import { Content } from "src/common/content";
import { Space } from "src/spaces/space.entity";
import { UserToSpace } from "src/user-to-spaces/user-to-space.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { RoleType } from './role-type.enum';

@Entity()
export class SpaceRole extends Content {

    @Column()
    roleName: string;

    @Column()
    roleType: RoleType;

    @ManyToOne(type => Space, space => space.spaceRoles, { eager: false })
    space: Space

}