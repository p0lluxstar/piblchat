import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.modules';
import { PrismaService } from './prisma/prisma.service';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, MessageModule, ChatModule, AuthModule],
  controllers: [AppController],
  providers: [ChatGateway, AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
