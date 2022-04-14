import { Space } from 'src/spaces/space.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { SpaceRole } from './space-role.entity';

@EntityRepository(SpaceRole)
export class SpaceRoleRepository extends Repository<SpaceRole> {

    createSpaceRoles(
        createSpaceRoleDtos: CreateSpaceRoleDto[],
        space: Space,
    ): SpaceRole[] {
        const spaceRoles: SpaceRole[] = this.buildSpaceRoles(createSpaceRoleDtos, space);
        this.save(spaceRoles);
        return spaceRoles;
    }

    buildSpaceRoles(createSpaceRoleDtos: CreateSpaceRoleDto[], space: Space): SpaceRole[] {
        const spaceRoles: SpaceRole[] = [];
        for (const spaceRoleDto of createSpaceRoleDtos) {
            const spaceRole: SpaceRole = this.create({
                roleName: spaceRoleDto.roleName,
                roleType: spaceRoleDto.roleType,
                space
            })
            spaceRoles.push(spaceRole);
        }
        return spaceRoles;
    }
}