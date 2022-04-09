import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { SpaceRole } from './space-role.entity';
import { SpaceRoleRepository } from './space-role.repository';

@Injectable()
export class SpaceRolesService {
    constructor(
        @InjectRepository(SpaceRoleRepository) 
        private spaceRoleRepository: SpaceRoleRepository
    ) {}

    buildSpaceRoles(createSpaceRoleDtos: CreateSpaceRoleDto[]): SpaceRole[] {
        return this.spaceRoleRepository.buildSpaceRoles(createSpaceRoleDtos);
    }
}