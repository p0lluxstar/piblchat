import { Injectable } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(userOneId: number, userTwoId: number): Promise<Chat> {
    const chat = await this.prisma.chat.create({
      data: {
        users: {
          connect: [{ id: userOneId }, { id: userTwoId }],
        },
      },
    });

    return chat;
  }

  async findChatByUserId(userId: number): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            userName: true,
            colorAvatar: true,
          },
        },
      },
    });
    return chats;
  }

  async findChatBetweenUsers(userOneId: number, userTwoId: number) {
    return await this.prisma.chat.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                id: userOneId,
              },
            },
          },
          {
            users: {
              some: {
                id: userTwoId,
              },
            },
          },
        ],
      },
      // include: {
      //   users: true, // Включить информацию о пользователях
      //   messages: true, // Включить сообщения (опционально)
      // },
    });
  }

  async deleteChatAndMessages(chatId: number): Promise<void> {
    await this.prisma.message.deleteMany({
      where: { chatId },
    });

    await this.prisma.chat.delete({
      where: { id: chatId },
    });
  }

  async getChatParticipants(chatId: number) {
    return this.prisma.chat
      .findUnique({
        where: { id: chatId },
        select: {
          users: {
            select: { id: true },
          },
        },
      })
      .then((chat) => chat?.users || []);
  }
}
