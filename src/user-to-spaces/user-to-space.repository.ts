import { RoleType } from "src/space-roles/role-type.enum";
import { SpaceRole } from "src/space-roles/space-role.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { UserToSpace } from "./user-to-space.entity";

@EntityRepository(UserToSpace)
export class UserToSpaceRepository extends Repository<UserToSpace> {

    buildUserToSpace(spaceRoles: SpaceRole[], user: User): UserToSpace {
        const defulatAdminRole: SpaceRole = spaceRoles.find(r => r.roleType === RoleType.ADMIN);
        const userToSpace: UserToSpace = this.create({
            spaceRoleId: defulatAdminRole.id,
            user,
        });
        return userToSpace;
    }
}