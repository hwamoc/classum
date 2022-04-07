import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Public } from 'src/skip-auth.decorator';
import { UsersService } from 'src/user/users.service';
import { multerOptions } from 'src/utils/multer-options';
import { User } from '../user/user.entity';
import UtilsService from '../utils/utils.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserSignupInfoDto } from './dto/user-signup-info.dto';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService, 
        private utilsService: UtilsService,
        private readonly usersService: UsersService,
    ) {}

    @Public()
    @Post('/signup')
    signUp(@Body(ValidationPipe) userSignupInfoDto: UserSignupInfoDto): Promise<any> {
        return this.authService.signUp(userSignupInfoDto);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async signIn(
        @Req() req: Request, 
        @Res({ passthrough: true }) res: Response
    ) {
        const user: User = req.user as User;
        const {
            accessToken,
            ...accessOption
        } = this.authService.getCookieWithJwtAccessToken(user.id);

        const {
            refreshToken,
            ...refreshOption
        } = this.authService.getCookieWithJwtRefreshToken(user.id);

        await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

        res.cookie('Authentication', accessToken, accessOption);
        res.cookie('Refresh', refreshToken, refreshOption);

        return user;
    }

    @Public()
    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(
        @Req() req, 
        @Res({ passthrough: true }) res: Response
    ) {
        const user = req.user;
        const {
            accessToken,
            ...accessOption
        } = this.authService.getCookieWithJwtAccessToken(user.id);
        res.cookie('Authentication', accessToken, accessOption);
        return user;
    }

    @Public()
    @UseGuards(JwtRefreshGuard)
    @Post('/signout')
    async signOut(
        @Req() req,
        @Res({ passthrough: true }) res: Response
    ) {
        const {
            accessOption,
            refreshOption,
        } = this.authService.getCookiesForLogOut();

        await this.usersService.removeRefreshToken(req.user.id);

        res.clearCookie('Authentication', accessOption);
        res.clearCookie('Refresh', refreshOption);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/upload-pfp')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    uploadProfile(@UploadedFile() file: Express.Multer.File) {
        const generatedFile: string = this.utilsService.uploadFile(file);
        // TODO: 응답 형태 통일
        return {
            status: 200,
            message: '파일 업로드를 성공하였습니다.',
            data: {
                files: generatedFile,
            },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('/authTest')
    test(@GetUser() user: User) {
        console.log('AUTH TEST>> user: ', user);
    }
}
