import { InternalServerErrorException } from "@nestjs/common";
import { SpaceRole } from "src/space-roles/space-role.entity";
import { Space } from "src/spaces/space.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { UserToSpace } from "./user-to-space.entity";

@EntityRepository(UserToSpace)
export class UserToSpaceRepository extends Repository<UserToSpace> {

    async createUserToSpace(spaceRole: SpaceRole, user: User, space: Space): Promise<string> {
        const userToSpace: UserToSpace = this.create({
            spaceRoleId: spaceRole.id,
            user,
            space
        });
        const saved = await this.save(userToSpace);
        
        if (!saved) {
            throw new InternalServerErrorException('Create user to space failed.')
        }
        return 'successfully invited';
    }
}