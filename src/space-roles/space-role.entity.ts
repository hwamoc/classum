import { CommonEntity } from "src/common/common-entity";
import { Space } from "src/spaces/space.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { RoleType } from './role-type.enum';

@Entity()
export class SpaceRole extends CommonEntity {

    @Column()
    roleName: string;

    @Column()
    roleType: RoleType;

    @ManyToOne(type => Space, space => space.spaceRoles, { eager: false })
    space: Space

}