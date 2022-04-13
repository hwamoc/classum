import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesModule } from 'src/spaces/spaces.module';
import { SpaceRoleRepository } from './space-role.repository';
import { SpaceRolesController } from './space-roles.controller';
import { SpaceRolesService } from './space-roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRoleRepository]),
    SpacesModule,
  ],
  controllers: [SpaceRolesController],
  providers: [SpaceRolesService],
  exports: [SpaceRolesService],
})
export class SpaceRolesModule {}