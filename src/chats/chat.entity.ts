import { Expose } from 'class-transformer';
import { RoleType } from 'src/space-roles/role-type.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../common/common-entity';
import { PostStatus } from '../posts/model/post-status.enum';
import { PostEntity } from '../posts/post.entity';

@Entity()
export class Chat extends CommonEntity {

    @Column({ nullable: true })
    headChat: number;

    @Column()
    @Expose({
        groups: [RoleType.ADMIN] 
    })
    userId: number;

    @Column()
    @Expose({
        groups: [RoleType.ADMIN] 
    })
    userName: string;

    @Column()
    content: string;

    @Column({
        default: PostStatus.PUBLIC
    })
    status: PostStatus;

    @ManyToOne(type => PostEntity, post => post.chats, {
        onUpdate: 'CASCADE',
        eager: false,
    })
    post: PostEntity;

}