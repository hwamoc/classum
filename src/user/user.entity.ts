import { Exclude } from 'class-transformer';
import { Content } from 'src/common/content';
import { Column, Entity, Unique } from 'typeorm';

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


}