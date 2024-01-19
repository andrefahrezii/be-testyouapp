// // src/chat/chat.gateway.ts
// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Socket } from 'socket.io';
// import { ChatService } from './chat.service';

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server;

//   constructor(private readonly chatService: ChatService) {}

//   handleConnection(client: any, ...args: any[]): any {
//     console.log('Client connected', client.id);
//   }

//   handleDisconnect(client: any): any {
//     console.log('Client disconnected', client.id);
//   }

//   handleJoin(client: Socket, data: { join: string }) {
//     this.chatService.addClient(client);
//     console.log('Client joined:', client.id);
//     client.emit('joined', 'You joined the chat');
//   }

//   @SubscribeMessage('message')
//   handleChatMessage(client: Socket, message: string) {
//     console.log('Received message from client:', message);
//     this.chatService.broadcastMessage(message);
//   }
// }

// src/chat/chat.gateway.ts
// src/chat/chat.gateway.ts

import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server; // Gunakan tipe Server dari socket.io

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket, ...args: any[]): any {
    console.log(`Client connected: ${client.id}`);
    console.log(`Query parameters: ${JSON.stringify(client.handshake.query)}`);
    console.log('Socket rooms:', client.rooms);
  }

  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('join')
  handleJoin(client: Socket, data: { join: string }) {
    this.chatService.addClient(client);
    console.log(`Client ${client.id} joined the chat`);
    client.emit('joined', 'You joined the chat');
  }

  @SubscribeMessage('message')
  handleChatMessage(client: Socket, message: string) {
    console.log(`Received message from ${client.id}: ${message}`);
    this.chatService.broadcastMessage(message);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    client: Socket,
    @MessageBody() payload: { message: string },
  ) {
    console.log(`Sending message from ${client.id}: ${payload.message}`);
    this.chatService.broadcastMessage(payload.message);
  }

  @SubscribeMessage('listenMessage')
  handleListenMessage(client: Socket) {
    console.log(`Client ${client.id} is listening for messages`);
  }
}
