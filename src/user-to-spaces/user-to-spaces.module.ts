import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToSpaceRepository } from './user-to-space.repository';
import { UserToSpacesController } from './user-to-spaces.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToSpaceRepository]),
  ],
  providers: [UserToSpacesService],
  exports: [UserToSpacesService],
})
export class UserToSpacesModule {}
