import { Content } from "src/common/content";
import { SpaceRole } from "src/space-roles/space-role.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserToSpace } from '../user-to-space/user-to-space.entity';

@Entity()
export class Space extends Content {

    @Column()
    founderId: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column()
    adminCode: string;

    @Column()
    participantCode: string;

    @OneToMany(type => UserToSpace, userToSpace => userToSpace.space, {
        cascade: ["insert", "update", "soft-remove"]
    })
    // TODO: property 뒤에! 붙는거 다 정리하자
    userToSpaces!: UserToSpace[];

    @OneToMany(type => SpaceRole, spaceRole => spaceRole.space, { 
        eager: true,
        // cascade: ["insert", "update", "soft-remove"]
    })
    spaceRoles: SpaceRole[];
}