import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SpaceRolesModule } from 'src/space-roles/space-roles.module';
import { SpaceRepository } from './space.repository';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRepository]),
    AuthModule,
    SpaceRolesModule,
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
