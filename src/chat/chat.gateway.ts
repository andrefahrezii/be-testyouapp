// src/chat/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDto, JoinRoomDto } from './chat.dto';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom') // Perubahan di sini
  handleJoinRoom(client: Socket, data: JoinRoomDto): void {
    const roomName = data.roomName;
    client.join(roomName);
    this.server.to(roomName).emit('joinedRoom', { roomId: roomName });

    const chatHistory = this.chatService.getChatHistory(roomName);
    client.emit('chatHistory', { roomId: roomName, history: chatHistory });
  }

  @SubscribeMessage('sendMessageToRoom') // Perubahan di sini
  handleSendMessageToRoom(client: Socket, message: MessageDto): void {
    const roomName = message.roomName;
    this.chatService.addMessage(roomName, message);
    this.server.to(roomName).emit('message', message);
  }
}
