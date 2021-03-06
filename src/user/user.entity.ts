import { Exclude, Expose } from 'class-transformer';
import { CommonEntity } from 'src/common/common-entity';
import { RoleType } from 'src/space-roles/role-type.enum';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { UserToSpace } from '../user-to-spaces/user-to-space.entity';

@Entity()
@Unique(['email'])
export class User extends CommonEntity {

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    @Exclude()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    profileUrl: string;

    @Column({ 
        nullable: true,
    })
    @Exclude()
    currentHashedRefreshToken?: string;

    @OneToMany(type => UserToSpace, userToSpace => userToSpace.user)
    userToSpaces!: UserToSpace[];

    @Column({ nullable: true })
    currentSpaceId: number;

    @Column({ nullable: true })
    currentRole: RoleType;

    @Expose()
    get fullname(): string {
        return `${this.firstname} ${this.lastname}`;
    }
}