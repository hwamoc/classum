import { Content } from "src/common/content";
import { Space } from "src/spaces/space.entity";
import { UserToSpace } from "src/user-to-space/user-to-space.entity";
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

    // TODO: eager 옵션 정리
    @OneToMany(type => UserToSpace, userToSpace => userToSpace.spaceRole, { eager: true })
    userToSpace: UserToSpace[];
}