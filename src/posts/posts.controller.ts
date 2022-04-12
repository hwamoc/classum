import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseFormDataJsonPipe } from 'src/common/pipes/parse-form-data-json.pipe';
import { User } from 'src/user/user.entity';
import { multerOptions } from 'src/utils/multer-options';
import { CreatePostBodyDto } from './dto/create-post-body.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Get('/:spaceId/posts')
    getAllPost(
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
        ) body: CreatePostBodyDto,
        @UploadedFiles() files: { images?: Express.Multer.File[], anyFiles?: Express.Multer.File[] },
        @GetUser() user: User
    ): Promise<PostEntity> {
        const createPostDto: CreatePostDto = (body as CreatePostBodyDto).data;
        return this.postsService.createPost(spaceId, createPostDto, files, user);
    }
}
