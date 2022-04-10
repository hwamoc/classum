import { RoleType } from "src/space-roles/role-type.enum";
import { SpaceRole } from "src/space-roles/space-role.entity";
import { Space } from "src/spaces/space.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { UserToSpace } from "./user-to-space.entity";

@EntityRepository(UserToSpace)
export class UserToSpaceRepository extends Repository<UserToSpace> {

    createUserToSpace(spaceRoles: SpaceRole[], user: User, space: Space): UserToSpace {
        const userToSpace: UserToSpace = this.create({
            spaceRoleId: spaceRoles[0].id,
            user,
            space
        });
        this.save(userToSpace);
        return userToSpace;
    }

    buildUserToSpace(spaceRoles: SpaceRole[], user: User): UserToSpace {
        const defulatAdminRole: SpaceRole = spaceRoles.find(r => r.roleType === RoleType.ADMIN);
        const userToSpace: UserToSpace = this.create({
            spaceRoleId: defulatAdminRole.id,
            user,
        });
        return userToSpace;
    }
}