import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfig } from './configs/typeorm.config';
import { FilesModule } from './files/files.module';
import { PostsModule } from './posts/posts.module';
import { SpaceRolesModule } from './space-roles/space-roles.module';
import { SpacesModule } from './spaces/spaces.module';
import { UserToSpacesModule } from './user-to-spaces/user-to-spaces.module';
import { UsersModule } from './user/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    BoardsModule,
    AuthModule,
    UtilsModule,
    UsersModule,
    SpacesModule,
    SpaceRolesModule,
    UserToSpacesModule,
    PostsModule,
    FilesModule,
  ],
  providers: [
    { 
      provide: APP_GUARD, 
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
