import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/createMessage';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(chatId: number, senderId: number, text: string): Promise<any> {
    if (!senderId) throw new UnauthorizedException();

    return this.prisma.message.create({
      data: {
        chatId,
        senderId,
        text,
      },
    });
  }

  async getMessagesByChatId(chatId: number): Promise<any[]> {
    return this.prisma.message.findMany({
      where: {
        chatId,
      },
    });
  }

  async deleteMessagesByChatId(chatId: number): Promise<any> {
    await this.prisma.message.deleteMany({
      where: { chatId },
    });
  }
}
