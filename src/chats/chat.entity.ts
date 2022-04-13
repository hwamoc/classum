import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../common/common-entity';
import { PostStatus } from '../posts/model/post-status.enum';
import { PostEntity } from '../posts/post.entity';

@Entity()
export class Chat extends CommonEntity {

    @Column({ nullable: true })
    headChat: number;

    @Column()
    userId: number;

    @Column()
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