// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { MessageDto } from './chat.dto';

@Injectable()
export class ChatService {
  private chatHistory: { [roomId: string]: MessageDto[] } = {};

  getChatHistory(roomId: string): MessageDto[] {
    return this.chatHistory[roomId] || [];
  }

  addMessage(roomId: string, message: MessageDto): void {
    if (!this.chatHistory[roomId]) {
      this.chatHistory[roomId] = [] as any;
    }
    this.chatHistory[roomId].push(message);
  }
}
