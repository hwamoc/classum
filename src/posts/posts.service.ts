import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileType } from 'src/files/file-type.enum';
import { FileEntity } from 'src/files/file.entity';
import { Space } from 'src/spaces/space.entity';
import { SpacesService } from 'src/spaces/spaces.service';
import { User } from 'src/user/user.entity';
import { UtilsService } from 'src/utils/utils.service';
import { FilesService } from '../files/files.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostRepository) 
        private postRepository: PostRepository,
        private spacesService: SpacesService,
        private filesService: FilesService,
        private utilsService: UtilsService,
    ) {}

    async getAllPosts(spaceId: number, user: User): Promise<PostEntity[]> {
        const query = this.postRepository.createQueryBuilder('p');

        // 익명 글 처리 해야함!
        query.where('p.spaceId = :spaceId', { spaceId });

        const posts = await query.getMany();

        return posts;
    }

    async createPost(
        spaceId: number,
        createPostDto: CreatePostDto, 
        files: { images?: Express.Multer.File[], anyFiles?: Express.Multer.File[] },
        user: User
    ): Promise<PostEntity> {
        const space: Space = await this.spacesService.getSpaceById(spaceId);
        let fileEntities: FileEntity[] = [];
        if (files?.images) {
            const imageUrls: string[] = this.utilsService.getFilesUrlArray(files.images);
            const imagesTemp: FileEntity[] = this.filesService.buildFiles(imageUrls, FileType.IMAGE);
            fileEntities = fileEntities.concat(imagesTemp);
        }
        if (files?.anyFiles) {
            const fileUrls: string[] = this.utilsService.getFilesUrlArray(files.anyFiles);
            const filesTemp: FileEntity[] = this.filesService.buildFiles(fileUrls, FileType.ETC);
            fileEntities = fileEntities.concat(filesTemp);
        }
        return this.postRepository.createPost(createPostDto, fileEntities, space, user);
    }
}
