import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchedRoleType } from 'src/space-roles/model/space-role.model';
import { SpaceRole } from 'src/space-roles/space-role.entity';
import { Space } from 'src/spaces/space.entity';
import { User } from 'src/user/user.entity';
import { Brackets, getManager } from 'typeorm';
import { CreateUserToSpaceDto } from './dto/create-user-to-space.dto';
import { UserToSpaceRepository } from './user-to-space.repository';

@Injectable()
export class UserToSpacesService {
    constructor(
        @InjectRepository(UserToSpaceRepository)
        private userToSpaceRepository: UserToSpaceRepository
    ) {}

    async createUserToSpace(createUserToSpaceDto: CreateUserToSpaceDto, user: User) {
        const entityManager = getManager();
        const { code } = createUserToSpaceDto;
        const space: Space = await this.validateCode(code, user);

        const fieldName = Object.keys(space).find(key => space[key] === code);
        const matchedRoleType: MatchedRoleType = new MatchedRoleType(fieldName);

        const spaceRoles: SpaceRole[] = await entityManager.createQueryBuilder(SpaceRole, 'sr')
                                                            .where('sr.spaceId = :spaceId', { spaceId: space.id })
                                                            .andWhere('sr.roleType = :roleType', { roleType: matchedRoleType.roleType })
                                                            .getMany();
        return this.userToSpaceRepository.createUserToSpace(spaceRoles[0], user, space);
    }

    async validateCode(code: string, user: User): Promise<Space> {
        const entityManager = getManager();
        const space: Space = await entityManager.createQueryBuilder(Space, 's')
                                                .andWhere(new Brackets(qb => {
                                                    qb.where('s.adminCode = :code', { code})
                                                    .orWhere('s.participantCode = :code', { code})    
                                                })).getOne();
        if (!space) {
            throw new NotFoundException(`Can't find Space with code: ${code}`);
        }

        const duplicate = await this.userToSpaceRepository.findOne({ user, space });
        if (duplicate) {
            throw new BadRequestException(`User id:${user.id} is already in this space id: ${space.id}`)
        }
        return space;
    }

}
