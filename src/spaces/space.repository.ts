import { SpaceRole } from "src/space-roles/space-role.entity";
import { UserToSpace } from "src/user-to-spaces/user-to-space.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { Space } from "./space.entity";

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {
    
    async buildSpace(
        createBoardDto: CreateSpaceDto, userToSpace: UserToSpace, spaceRoles: SpaceRole[], user: User
    ): Promise<Space> {
        const { title, logoUrl } = createBoardDto;
        const adminCode: string = await this.getUniqueCode();
        const participantCode: string = await this.getUniqueCode();
        const userToSpaces: UserToSpace[] = [userToSpace];

        const space: Space = this.create({
            ownerId: user.id, 
            title,
            logoUrl,
            adminCode,
            participantCode,
            userToSpaces,
            spaceRoles
        });
        return space;
    }

    async getUniqueCode(): Promise<string> {
        let code: string = Math.random().toString(36).substring(2,10);
        let unique: boolean = false;
        while (!unique) {
            const duplicateAdmin = await this.findOne({ adminCode: code });
            const duplicateParticipant = await this.findOne({ participantCode: code });
            if (duplicateAdmin || duplicateParticipant) {
                code = Math.random().toString(36).substring(2,10);
                continue;
            } 
            unique = true;
        }
        return code;
    }
}