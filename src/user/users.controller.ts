import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/skip-auth.decorator';
import { multerOptions } from 'src/utils/multer-options';
import UtilsService from 'src/utils/utils.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    authService: any;
    constructor(
        private readonly usersService: UsersService,
        private utilsService: UtilsService,
    ) {}

    @Public()
    @Get(':email')
    getByEmail(@Param() email: string): Promise<User> {
        return this.usersService.getByEmail(email);
    }

    @Post('/upload-pfp')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    uploadProfile(
        @GetUser() user: User,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<void> {
        return this.usersService.uploadProfile(user, file);
        // TODO: 응답 형태 통일
    }
}