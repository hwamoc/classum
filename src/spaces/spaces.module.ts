import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SpaceRolesModule } from 'src/space-roles/space-roles.module';
import { UserToSpacesModule } from 'src/user-to-spaces/user-to-spaces.module';
import { UtilsService } from 'src/utils/utils.service';
import { SpaceRepository } from './space.repository';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRepository]),
    AuthModule,
    SpaceRolesModule,
    UsersModule,
    // UserToSpacesModule,
  ],
  controllers: [SpacesController],
  providers: [SpacesService, UtilsService],
  exports: [SpacesService],
})
export class SpacesModule {}
