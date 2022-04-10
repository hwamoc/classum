import { Content } from "src/common/content";
import { SpaceRole } from "src/space-roles/space-role.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserToSpace } from '../user-to-spaces/user-to-space.entity';

@Entity()
export class Space extends Content {

    @Column()
    founderId: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ unique: true })
    adminCode: string;

    @Column({ unique: true })
    participantCode: string;

    @OneToMany(type => UserToSpace, userToSpace => userToSpace.space, {
        cascade: ["insert", "update", "soft-remove"],
    })

    userToSpaces: UserToSpace[];

    @OneToMany(type => SpaceRole, spaceRole => spaceRole.space, { 
        cascade: ["insert", "update", "soft-remove"],
    })
    spaceRoles: SpaceRole[];
}