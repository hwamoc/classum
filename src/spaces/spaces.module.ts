import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UtilsService } from 'src/utils/utils.service';
import { UsersModule } from '../user/users.module';
import { SpaceRepository } from './space.repository';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRepository]),
    AuthModule,
    UsersModule,
  ],
  controllers: [SpacesController],
  providers: [SpacesService, UtilsService],
  exports: [SpacesService],
})
export class SpacesModule {}
