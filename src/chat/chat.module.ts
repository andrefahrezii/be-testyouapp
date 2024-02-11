import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: '1234',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ChatGateway, ChatService, AuthService],
  controllers: [ChatController],
})
export class ChatModule {}
