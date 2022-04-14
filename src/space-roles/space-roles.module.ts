import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/common/logger/logger.module';
import { SpacesModule } from 'src/spaces/spaces.module';
import { SpaceRoleRepository } from './space-role.repository';
import { SpaceRolesController } from './space-roles.controller';
import { SpaceRolesService } from './space-roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRoleRepository]),
    SpacesModule,
    LoggerModule,
  ],
  controllers: [SpaceRolesController],
  providers: [SpaceRolesService],
  exports: [SpaceRolesService],
})
export class SpaceRolesModule {}