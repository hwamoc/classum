import { Expose } from "class-transformer";
import { CommonEntity } from "src/common/common-entity";
import { FileEntity } from "src/files/file.entity";
import { RoleType } from "src/space-roles/role-type.enum";
import { Space } from "src/spaces/space.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { PostStatus } from "./model/post-status.enum";
import { PostType } from "./model/post-type.enum";

@Entity()
export class PostEntity extends CommonEntity {
    
    @Column()
    postType: PostType;

    @Column()
    userId: number; 

    @Column()
    @Expose({
        groups: [RoleType.ADMIN] 
    })
    username: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({
        default: PostStatus.PUBLIC
    })
    status: PostStatus;

    @OneToMany(type => FileEntity, file => file.post, { 
        cascade: ["insert", "update", "soft-remove"],
    })
    files: FileEntity[];

    @ManyToOne(type => Space, space => space.posts, {
        onUpdate: 'CASCADE',
    })
    space: Space;

}