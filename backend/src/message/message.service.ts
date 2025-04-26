import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/createMessage';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: CreateMessageDto) {
    const { chatId, text } = data;

    console.log('createMessage', data);

    return this.prisma.message.create({
      data: {
        chatId,
        text,
      },
    });
  }
}
