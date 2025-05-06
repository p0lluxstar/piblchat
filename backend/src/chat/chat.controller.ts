import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { AuthGuard } from '../user/guards/auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly userService: ChatService) {}

  @Get()
  @UseGuards(AuthGuard)
  async temp(): Promise<string> {
    return 'chat';
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async findChatByUserId(@Query('userId') userId: string): Promise<Chat[]> {
    return this.userService.findChatByUserId(Number(userId));
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteChatByChatId(@Query('chatId') chatId: string): Promise<{ success: boolean }> {
    await this.userService.deleteChatAndMessages(Number(chatId));
    return { success: true };
  }
}
