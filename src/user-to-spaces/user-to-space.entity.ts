import { Content } from 'src/common/content';
import { Space } from 'src/spaces/space.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class UserToSpace extends Content {

    @Column({
        nullable: true
    })
    spaceRoleId: number;

    @ManyToOne(type => User, user => user.userToSpaces)
    user: User;

    @ManyToOne(type => Space, space => space.userToSpaces)
    space: Space;
}