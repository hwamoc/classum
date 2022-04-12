import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/skip-auth.decorator';
import { multerImageOptions } from 'src/utils/multer-options';
import { UtilsService } from 'src/utils/utils.service';
import { Id } from './model/user.model';
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

    // for test
    @Public()
    @Get(':id')
    getById(@Param() id: Id): Promise<User> {
        return this.usersService.getOneBy(id);
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