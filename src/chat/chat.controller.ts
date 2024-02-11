// src/chat/chat.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageDto } from './chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  sendMessage(@Body() messageDto: MessageDto): string {
    // Logic for sending a message
    return `Sent message: ${messageDto.content}`;
  }
}
