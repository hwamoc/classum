import { CommonEntity } from "src/common/common-entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { PostEntity } from '../posts/post.entity';
import { FileType } from "./file-type.enum";

@Entity()
export class FileEntity extends CommonEntity {

    @Column()
    url: string;

    @Column()
    type: FileType;

    @ManyToOne(type => PostEntity, post => post.files, {
        onUpdate: 'CASCADE',
        eager: false,
    })
    post: PostEntity;
}