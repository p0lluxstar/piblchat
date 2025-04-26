import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/createMessage';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async temp(): Promise<string> {
    return 'message';
  }

  @Post()
  async createMessage(@Body() body: CreateMessageDto) {
    const message = await this.messageService.createMessage(body);
    return message;
  }
}
