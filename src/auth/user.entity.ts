import { Content } from 'src/common/content';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Board } from '../boards/board.entity';

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

    @OneToMany(type => Board, board => board.user, { eager: true })
    boards: Board[];

}