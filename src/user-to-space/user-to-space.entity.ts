import { User } from 'src/user/user.entity';
import { Content } from 'src/common/content';
import { Space } from 'src/spaces/space.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { SpaceRole } from '../space-roles/space-role.entity';

@Entity()
export class UserToSpace extends Content {

    @ManyToOne(type => SpaceRole, spaceRole => spaceRole.userToSpace, { 
        eager: false,
    })
    spaceRole: SpaceRole;

    @ManyToOne(type => User, user => user.userToSpaces)
    user: User;

    @ManyToOne(type => Space, space => space.userToSpaces)
    space: Space;
}