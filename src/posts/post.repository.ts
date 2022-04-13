import { FileEntity } from 'src/files/file.entity';
import { Space } from 'src/spaces/space.entity';
import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PostStatus } from './model/post-status.enum';
import { PostType } from './model/post-type.enum';
import { PostEntity } from "./post.entity";

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {

    async createPost(createPostDto: CreatePostDto, fileEntities: FileEntity[], space: Space, user: User): Promise<PostEntity> {
        
        const { postType, title, content, status } = createPostDto;

        const post: PostEntity = this.create({
            postType: PostType[postType.toUpperCase()],
            userId: user.id,
            username: user.fullname,
            title,
            content,
            status: PostStatus[status?.toUpperCase()],
            files: fileEntities,
            space
        });

        await this.save(post);
        return post;
    }
}