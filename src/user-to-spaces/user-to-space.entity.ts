import { CommonEntity } from 'src/common/common-entity';
import { Space } from 'src/spaces/space.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class UserToSpace extends CommonEntity {

    @Column({
        nullable: true
    })
    spaceRoleId: number;

    @ManyToOne(type => User, user => user.userToSpaces, {
        onUpdate: 'CASCADE',
    })
    user: User;

    @ManyToOne(type => Space, space => space.userToSpaces, {
        onUpdate: 'CASCADE',
    })
    space: Space;
}