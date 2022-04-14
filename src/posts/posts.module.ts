import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { FilesModule } from 'src/files/files.module';
import { SpacesModule } from 'src/spaces/spaces.module';
import { UtilsService } from 'src/utils/utils.service';
import { PostRepository } from './post.repository';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    AuthModule,
    SpacesModule,
    FilesModule,
    LoggerModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, UtilsService],
  exports: [PostsService]
})
export class PostsModule {}
