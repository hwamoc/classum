import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from 'src/spaces/space.entity';
import { SpacesService } from 'src/spaces/spaces.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { SpaceRole } from './space-role.entity';
import { SpaceRoleRepository } from './space-role.repository';

@Injectable()
export class SpaceRolesService {
    constructor(
        @InjectRepository(SpaceRoleRepository) 
        private spaceRoleRepository: SpaceRoleRepository,
        private spacesService: SpacesService,
    ) {}

    async getAllSpaceRoles(spaceId: number): Promise<SpaceRole[]> {
        const query = this.spaceRoleRepository.createQueryBuilder('sr');
        const spaceRoles: SpaceRole[] = await query.where('sr.spaceId = :spaceId', { spaceId }).getMany();
        if (spaceRoles?.length === 0) {
            throw new NotFoundException(`Can't find Space role with id: ${spaceId}`);
        }
        return spaceRoles;
    }

    async createSpaceRole(
        spaceId: number, createSpaceRoleDtos: CreateSpaceRoleDto[]
    ): Promise<SpaceRole[]> {
        const space: Space = await this.spacesService.getSpaceById(spaceId);
        return this.spaceRoleRepository.createSpaceRoles(createSpaceRoleDtos, space);
    }

    buildSpaceRoles(createSpaceRoleDtos: CreateSpaceRoleDto[], space: Space | null): SpaceRole[] {
        return this.spaceRoleRepository.buildSpaceRoles(createSpaceRoleDtos, space);
    }

    async deleteSpaceRole(id: number): Promise<string> {
        const result = await this.spaceRoleRepository.softDelete({ id });
        if (result.affected === 0) {
            throw new NotFoundException(`Can't delete Space role with id: ${id}`);
        }
        return 'successfully deleted';
    }
}