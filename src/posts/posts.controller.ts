import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
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
    @UseGuards(RolesGuard)
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
        ) body: CreatePostBodyDto,
        @UploadedFiles() files: { images?: Express.Multer.File[], anyFiles?: Express.Multer.File[] },
        @GetUser() user: User
    ): Promise<PostEntity> {
        const createPostDto: CreatePostDto = (body as CreatePostBodyDto).data;
        return this.postsService.createPost(spaceId, createPostDto, files, user);
    }

    @Get('/:spaceId/posts/:id')
    @UseInterceptors(RoleSanitizeInterceptor)
    @UseGuards(RolesGuard)
    getPost(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PostEntity> {
        return this.postsService.getPost(id);
    }

    @Delete('/:spaceId/posts/:id')
    @Roles(RoleType.ADMIN)
    @UseGuards(RolesGuard)
    deletePost(
        @Param('spaceId', ParseIntPipe) spaceId: number,
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.postsService.deletePost(spaceId, id, user);
    }
}
