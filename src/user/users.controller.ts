import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AppLogger } from 'src/common/logger/logger.service';
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
        private readonly appLogger: AppLogger,
    ) {}

    @Get(':id')
    getUser(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<User> {
        this.appLogger.log(`GET /users/${id} has been excuted.`);
        return this.usersService.getOneBy({ id });
    }

    /*
    * 프로필 사진 업로드
    */
    @Post('/profile')
    @UseInterceptors(FileInterceptor('file', multerImageOptions))
    updateProfile(
        @GetUser() user: User,
        @UploadedFile() image: Express.Multer.File,
    ): Promise<string> {
        this.appLogger.log(`POST /users/profile has been excuted.`);
        return this.usersService.updateProfile(user, image);
    }
}