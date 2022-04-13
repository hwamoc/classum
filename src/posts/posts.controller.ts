import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Self } from 'src/auth/decorator/self.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SelfGuard } from 'src/auth/guards/self.guard';
import { RoleSanitizeInterceptor } from 'src/common/interceptors/role-sanitize.interceptor';
import { ParseFormDataJsonPipe } from 'src/common/pipes/parse-form-data-json.pipe';
import { RoleType } from 'src/space-roles/role-type.enum';
import { User } from 'src/user/user.entity';
import { multerOptions } from 'src/utils/multer-options';
import { CreatePostBodyDto } from './dto/create-post-body.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('spaces')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Get('/:spaceId/posts')
    @UseInterceptors(RoleSanitizeInterceptor)
    getAllPosts(
        @Param('spaceId', ParseIntPipe) spaceId: number,
        @GetUser() user: User
    ): Promise<PostEntity[]> {
        return this.postsService.getAllPosts(spaceId, user);
    }

    @Post('/:spaceId/posts')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'anyFiles', maxCount: 10 },
    ], multerOptions))
    createPost(
        @Param('spaceId', ParseIntPipe) spaceId: number,
        @Body(
            new ParseFormDataJsonPipe({ except: ['files', 'images'] }),
            new ValidationPipe(),
        ) body: CreatePostBodyDto, // dto의 userId는 작성자 아이디를 의미하며, 익명 글 작성 여부 판별에 사용된다.
        @UploadedFiles() files: { images?: Express.Multer.File[], anyFiles?: Express.Multer.File[] },
        @GetUser() user: User
    ): Promise<PostEntity> {
        const createPostDto: CreatePostDto = (body as CreatePostBodyDto).data;
        return this.postsService.createPost(spaceId, createPostDto, files, user);
    }

    @Get('/posts/:id')
    @UseInterceptors(RoleSanitizeInterceptor)
    getPost(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PostEntity> {
        return this.postsService.getPost(id, true);
    }

    @Delete('/posts/:id')
    @Self({userIDParam: 'writerId', allowAdmins: true})
    @UseGuards(SelfGuard)
    deletePost(
        @Param('id', ParseIntPipe) id: number,
        @Param('writerId') writerId: number,  // 작성자 id, SelfGuard에서 사용함
    ): Promise<string> {
        return this.postsService.deletePost(id);
    }
}
