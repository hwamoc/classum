import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PostsModule } from '../posts/posts.module';
import { ChatRepository } from './chat.repository';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRepository]),
    PostsModule,
    LoggerModule,
  ],
  providers: [ChatsService],
  controllers: [ChatsController]
})
export class ChatsModule {}
