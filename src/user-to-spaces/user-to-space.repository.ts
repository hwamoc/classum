import { RoleType } from "src/space-roles/role-type.enum";
import { SpaceRole } from "src/space-roles/space-role.entity";
import { Space } from "src/spaces/space.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { UserToSpace } from "./user-to-space.entity";

@EntityRepository(UserToSpace)
export class UserToSpaceRepository extends Repository<UserToSpace> {

    createUserToSpace(spaceRole: SpaceRole, user: User, space: Space): UserToSpace {
        const userToSpace: UserToSpace = this.create({
            spaceRoleId: spaceRole.id,
            user,
            space
        });
        this.save(userToSpace);
        return userToSpace;
    }
}