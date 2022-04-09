import { EntityRepository, Repository } from 'typeorm';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { SpaceRole } from './space-role.entity';

@EntityRepository(SpaceRole)
export class SpaceRoleRepository extends Repository<SpaceRole> {

    buildSpaceRoles(createSpaceRoleDtos: CreateSpaceRoleDto[]): SpaceRole[] {
        const spaceRoles: SpaceRole[] = [];
        for (const spaceRoleDto of createSpaceRoleDtos) {
            const spaceRole: SpaceRole = this.create({
                roleName: spaceRoleDto.roleName,
                roleType: spaceRoleDto.roleType
            })
            spaceRoles.push(spaceRole);
        }
        return spaceRoles;
    }
}