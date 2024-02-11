import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MessageDto } from './chat.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatService {
  private chatHistory: { [roomId: string]: MessageDto[] } = {};

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  getChatHistory(roomId: string): MessageDto[] {
    return this.chatHistory[roomId] || [];
  }

  async addMessage(
    roomId: string,
    message: MessageDto,
    token: string,
  ): Promise<void> {
    const user = await this.validateJwtToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    if (!this.chatHistory[roomId]) {
      this.chatHistory[roomId] = [] as MessageDto[];
    }
    this.chatHistory[roomId].push(message);
  }

  private async validateJwtToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.authService.validateToken(token);
      if (decodedToken && decodedToken.username) {
        return decodedToken.username;
      } else {
        console.error('Invalid JWT token structure. Token:', token);
        return null;
      }
    } catch (error) {
      console.error('Error validating JWT. Token:', token);
      console.error('Error details:', error.message);
      return null;
    }
  }
}
