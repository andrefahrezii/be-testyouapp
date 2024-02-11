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

    // Mengambil daftar room yang diikuti oleh klien
    const rooms = Array.from(client.rooms);

    if (rooms.length > 0) {
      // Mengambil room yang pertama (misalnya, jika klien hanya ada di satu room)
      const roomName = rooms[1];

      // Mengirimkan informasi room ke klien
      client.emit('joinRoom', { roomName, token: 'exampleToken' });
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  // ...
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, data: JoinRoomDto): Promise<void> {
    const roomName = data.roomName;

    // Validasi dan autentikasi token JWT
    const user = await this.validateJwtToken(data.token);

    if (!user) {
      // Token tidak valid, kirim pesan umum dan tangani kesalahan lebih rinci di sisi klien
      client.emit('authenticationError', { message: 'Authentication failed' });
      return;
    }

    // Pengguna berhasil terotentikasi, bergabung ke room
    client.join(roomName);
    this.server.to(roomName).emit('joinedRoom', { roomId: roomName });

    const chatHistory = this.chatService.getChatHistory(roomName);
    client.emit('chatHistory', { roomId: roomName, history: chatHistory });

    // Listen for incoming messages
    client.on('message', (message) => {
      console.log(`Received message in room ${roomName}:`, message);
      // Do whatever you want with the received message
    });
  }

  private async validateJwtToken(token: string): Promise<any> {
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

    // Validasi dan autentikasi token JWT
    const user = this.validateJwtToken(message.token);

    if (!user) {
      // Token tidak valid, kirim pesan umum dan tangani kesalahan lebih rinci di sisi klien
      client.emit('authenticationError', { message: 'Authentication failed' });
      return;
    }

    // Pengguna berhasil terotentikasi, kirim pesan ke room
    this.chatService.addMessage(roomName, message, message.token);
    this.server.to(roomName).emit('message', message); // Emit to the specific room
  }
}
