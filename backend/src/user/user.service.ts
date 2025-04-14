import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { IUserResponse } from './user.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      include: { role: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException(
        'The user with this email already exists',
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
        name: user.name,
        email: user.email,
        roleId: user.roleId,
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
}
