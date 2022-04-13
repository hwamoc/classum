import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Post, Res, SerializeOptions, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleType } from 'src/space-roles/role-type.enum';
import { multerImageOptions } from 'src/utils/multer-options';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class UsersController {
    authService: any;
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get(':id')
    getById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<User> {
        return this.usersService.getOneBy({ id });
    }

    @Post('/profile')
    @UseInterceptors(FileInterceptor('file', multerImageOptions))
    updateProfile(
        @GetUser() user: User,
        @UploadedFile() image: Express.Multer.File,
    ): Promise<void> {
        return this.usersService.updateProfile(user, image);
        // TODO: 응답 형태 통일
    }
}