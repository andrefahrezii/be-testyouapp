import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDto, JoinRoomDto } from './chat.dto';
import { AuthService } from '../auth/auth.service';
import { TypingDto } from './chat.dto';
@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);

    const rooms = Array.from(client.rooms);

    if (rooms.length > 0) {
      const roomName = rooms[1];

      client.emit('joinRoom', { roomName, token: 'exampleToken' });
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, data: JoinRoomDto): Promise<void> {
    const roomName = data.roomName;

    const username = await this.validateJwtToken(data.token);

    if (!username) {
      client.emit('authenticationError', { message: 'Authentication failed' });
      return;
    }

    client.join(roomName);
    this.server.to(roomName).emit('joinedRoom', { roomId: roomName });

    const chatHistory = this.chatService.getChatHistory(roomName);
    client.emit('chatHistory', { roomId: roomName, history: chatHistory });

    client.on('typing', (typingData: TypingDto) => {
      const { isTyping } = typingData;
      const message = `${username} is ${isTyping ? 'typing...' : 'stopped typing.'}`;
      this.server.to(roomName).emit('typingStatus', { message });
    });

    client.on('message', (message: MessageDto) => {
      const messageWithSender = { ...message, sender: username };

      this.server.to(roomName).emit('message', messageWithSender);
    });
  }

  private async validateJwtToken(token: string): Promise<string | null> {
    try {
      const decodedToken = await this.authService.validateToken(token);
      return decodedToken ? decodedToken.username : null;
    } catch (error) {
      console.error('Error validating JWT:', error.message);
      return null;
    }
  }

  @SubscribeMessage('sendMessageToRoom')
  handleSendMessageToRoom(client: Socket, message: MessageDto): void {
    const roomName = message.roomName;

    this.validateJwtToken(message.token)
      .then((username) => {
        if (!username) {
          client.emit('authenticationError', {
            message: 'Authentication failed',
          });
          return;
        }

        const messageWithSender: MessageDto = {
          sender: username,
          roomName: message.roomName,
          content: message.content,
          token: message.token,
        };

        this.chatService.addMessage(roomName, messageWithSender, message.token);
        this.server.to(roomName).emit('message', messageWithSender);
      })
      .catch((error) => {
        console.error('Error validating JWT:', error.message);
        client.emit('authenticationError', {
          message: 'Authentication failed',
        });
      });
  }
  @SubscribeMessage('typing') // Listen for typing events
  handleTypingEvent(client: Socket, typingData: TypingDto): void {
    const roomName = typingData.roomName;
    const isTyping = typingData.isTyping;

    client
      .to(roomName)
      .emit('typing', { username: client.data.username, isTyping });
  }
}
