import { CommonEntity } from 'src/common/common-entity';
import { RoleType } from 'src/space-roles/role-type.enum';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Board } from '../boards/board.entity';
import { UserToSpace } from '../user-to-spaces/user-to-space.entity';

@Entity()
@Unique(['email'])
export class User extends CommonEntity {

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true })
    profileUrl: string;

    @Column({ 
        nullable: true,
        select: false,
    })
    currentHashedRefreshToken?: string;

    @OneToMany(type => UserToSpace, userToSpace => userToSpace.user)
    userToSpaces!: UserToSpace[];

    @OneToMany(type => Board, board => board.user, { eager: true })
    boards: Board[];

    @Column()
    currentRole: RoleType;
}