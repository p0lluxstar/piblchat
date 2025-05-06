import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';
import { CreateMessageDto } from './dto/createMessage';
import { MessageService } from './message.service';
import type { Message } from '@prisma/client';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @UseGuards(AuthGuard)
  async temp(): Promise<string> {
    return 'message';
  }

  @Get('get-messages')
  @UseGuards(AuthGuard)
  async getMessagesByChatId(@Query('chatId') chatId: number): Promise<Message[]> {
    return this.messageService.getMessagesByChatId(chatId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createMessage(@Body() body: CreateMessageDto): Promise<Message> {
    const message = await this.messageService.createMessage(body.chatId, body.senderId, body.text);
    return message;
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteMessagesByChatId(@Query('chatId') chatId: string): Promise<{ success: boolean }> {
    await this.messageService.deleteMessagesByChatId(Number(chatId));
    return { success: true };
  }
}
