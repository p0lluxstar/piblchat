import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from './dto/createMessage';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async temp(): Promise<string> {
    return 'message';
  }

  @Get('get-messages')
  async getMessagesByChatId(@Query('chatId') chatId: number): Promise<any[]> {
    return this.messageService.getMessagesByChatId(chatId);
  }

  @Post()
  async createMessage(@Body() body: CreateMessageDto) {
    const message = await this.messageService.createMessage(body.chatId, body.senderId, body.text);
    return message;
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteMessagesByChatId(@Query('chatId') chatId: string): Promise<any[]> {
    return this.messageService.deleteMessagesByChatId(Number(chatId));
  }
}
