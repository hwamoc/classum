import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/common/logger/logger.module';
import { UserRepository } from 'src/user/user.repository';
import { UtilsService } from 'src/utils/utils.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UtilsService],
  exports: [UsersService],
})
export class UsersModule {}