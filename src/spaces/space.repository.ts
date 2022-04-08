import { RoleType } from "src/space-roles/role-type.enum";
import { SpaceRole } from "src/space-roles/space-role.entity";
import { UserToSpace } from "src/user-to-space/user-to-space.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { Space } from "./space.entity";

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {

    async createSpace(createBoardDto: CreateSpaceDto, spaceRoles: SpaceRole[], user: User): Promise<Space> {
        const { title, logoUrl } = createBoardDto;
        const adminCode: string = Math.random().toString(36).substring(2,10);
        const participantCode: string = Math.random().toString(36).substring(2,10);

        const userToSpace: UserToSpace = new UserToSpace();
        const defulatAdminRole: SpaceRole = spaceRoles.find(r => r.roleType === RoleType.ADMIN);
        userToSpace.spaceRole = defulatAdminRole;
        userToSpace.user = user;
        const userToSpaces: UserToSpace[] = [userToSpace];

        const space: Space = this.create({
            founderId: user.id, 
            title,
            logoUrl,
            adminCode,
            participantCode,
            userToSpaces,
            spaceRoles
        });

        await this.save(space);
        return space;
    }
}