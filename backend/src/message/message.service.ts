import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Message } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(chatId: number, senderId: number, text: string): Promise<Message> {
    if (!senderId) throw new UnauthorizedException();

    return this.prisma.message.create({
      data: {
        chatId,
        senderId,
        text,
      },
    });
  }

  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        chatId,
      },
    });
  }

  async deleteMessagesByChatId(chatId: number): Promise<{ success: boolean }> {
    await this.prisma.message.deleteMany({
      where: { chatId },
    });

    return { success: true };
  }
}
