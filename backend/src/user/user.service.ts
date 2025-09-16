import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ILoginResponse, IUserResponse } from './user.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      include: { role: true },
    });
  }

  async findUserByUserName(userName: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { userName } });
  }

  async findUsersByUserName(
    userName: string
  ): Promise<{ id: number; userName: string; email: string; colorAvatar: string }[]> {
    return this.prisma.user.findMany({
      where: {
        userName: {
          startsWith: userName,
          mode: 'insensitive', // игнорирует регистр
        },
      },
      select: {
        id: true,
        userName: true,
        email: true,
        colorAvatar: true,
      },
      take: 30, // ограничиваем количество результатов до 30
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const existingUserByUserName = await this.prisma.user.findUnique({
      where: { userName: data.userName },
    });

    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUserByUserName || existingUserByEmail) {
      throw new HttpException(
        'Пользователь с таким именем или email уже существует',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  generateToken(user: User): string {
    return sign(
      {
        id: user.id,
        userName: user.userName,
        email: user.email,
        roleId: user.roleId,
        colorAvatar: user.colorAvatar,
      },
      process.env.JWT_SECRET
    );
  }

  buildUserResponse(user: User): IUserResponse {
    return {
      ...user,
      token: this.generateToken(user),
    };
  }

  async login(data: ILoginResponse): Promise<User> {
    const user = await this.findByEmail(data.email);

    const isPasswordValid = user && (await bcrypt.compare(data.password, user.password));

    if (!isPasswordValid) {
      throw new HttpException('Неверный email или пароль', HttpStatus.UNAUTHORIZED);
    }

    delete user.password; // !!! надо переделать

    return user;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Копируем все поля, кроме пароля
    const updatedData = { ...data };

    // Если в запросе есть новый пароль — хешируем его
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
  }

  async findByUserNameForChat(userName: string): Promise<Pick<User, 'id' | 'userName'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { userName },
      select: {
        id: true,
        userName: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async deleteUser(userName: string): Promise<User | null> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Находим пользователя
      const user = await tx.user.findUnique({
        where: { userName },
        select: { id: true },
      });

      if (!user) return null;

      // 2. Находим все чаты, где он участвовал
      const chats = await tx.chat.findMany({
        where: {
          users: { some: { id: user.id } },
        },
        select: { id: true },
      });

      const chatIds = chats.map((c) => c.id);

      if (chatIds.length > 0) {
        // 3. Удаляем сообщения в этих чатах
        await tx.message.deleteMany({
          where: { chatId: { in: chatIds } },
        });

        // 4. Удаляем сами чаты
        await tx.chat.deleteMany({
          where: { id: { in: chatIds } },
        });
      }

      // 5. Удаляем пользователя
      const deletedUser = await tx.user.delete({
        where: { userName },
      });

      return deletedUser;
    });
  }
}
