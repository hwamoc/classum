import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleRepository } from './space-role.repository';
import { SpaceRolesService } from './space-roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRoleRepository]),
  ],
  providers: [SpaceRolesService],
  exports: [SpaceRolesService],
})
export class SpaceRolesModule {}