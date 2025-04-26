import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly userService: ChatService) {}

  @Get()
  async temp(): Promise<string> {
    return 'chat';
  }
}
