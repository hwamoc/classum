import { Exclude } from 'class-transformer';
import { Content } from 'src/common/content';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Board } from '../boards/board.entity';
import { UserToSpace } from '../user-to-space/user-to-space.entity';

@Entity()
@Unique(['email'])
export class User extends Content {

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    profileUrl: string;

    @Column({ nullable: true })
    @Exclude()
    currentHashedRefreshToken?: string;

    @OneToMany(type => UserToSpace, userToSpace => userToSpace.user)
    userToSpaces!: UserToSpace[];

    @OneToMany(type => Board, board => board.user, { eager: true })
    boards: Board[];

}