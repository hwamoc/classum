import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRole } from 'src/space-roles/space-role.entity';
import { User } from 'src/user/user.entity';
import { UserToSpace } from './user-to-space.entity';
import { UserToSpaceRepository } from './user-to-space.repository';

@Injectable()
export class UserToSpacesService {
    constructor(
        @InjectRepository(UserToSpaceRepository)
        private userToSpaceRepository: UserToSpaceRepository
    ) {}

    buildUserToSpace(spaceRoles: SpaceRole[], user: User): UserToSpace {
        return this.userToSpaceRepository.buildUserToSpace(spaceRoles, user);
    }
}
