// src/chat/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: any, ...args: any[]): any {
    console.log('Client connected');
  }

  handleDisconnect(client: any): any {
    console.log('Client disconnected');
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket) {
    this.chatService.addClient(client);
    client.emit('joined', 'You joined the chat');
  }

  @SubscribeMessage('message')
  handleChatMessage(client: Socket, message: string) {
    this.chatService.broadcastMessage(message);
  }
}
