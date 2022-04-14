import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { UserToSpaceRepository } from './user-to-space.repository';
import { UserToSpacesController } from './user-to-spaces.controller';
import { UserToSpacesService } from './user-to-spaces.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToSpaceRepository]),
    AuthModule,
    LoggerModule,
  ],
  controllers: [UserToSpacesController],
  providers: [UserToSpacesService],
  exports: [UserToSpacesService],
})
export class UserToSpacesModule {}
