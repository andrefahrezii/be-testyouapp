import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './user/jwt-auth.guard';
import * as bodyParser from 'body-parser';
@Module({
  // imports: [AuthModule, ChatModule, ProfileModule],
  imports: [AuthModule, ChatModule, UserModule],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(bodyParser.json({ limit: '20mb' })).forRoutes('*');
    consumer
      .apply(bodyParser.urlencoded({ extended: true, limit: '20mb' }))
      .forRoutes('*');
  }
}
