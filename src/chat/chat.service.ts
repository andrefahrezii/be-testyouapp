// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  private clients: Socket[] = [];

  addClient(client: Socket) {
    this.clients.push(client);
  }

  broadcastMessage(message: string) {
    this.clients.forEach((client) => {
      client.emit('listenMessage', { content: message });
    });
  }
}
