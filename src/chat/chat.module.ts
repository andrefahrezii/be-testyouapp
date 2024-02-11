// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: '1234', // Gantilah dengan kunci rahasia JWT Anda
      signOptions: { expiresIn: '1h' }, // Sesuaikan opsi sesuai kebutuhan Anda
    }),
  ],
  providers: [ChatGateway, ChatService, AuthService],
  controllers: [ChatController],
})
export class ChatModule {}
