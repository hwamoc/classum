import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from 'src/common/logger/logger.service';
import { Public } from 'src/skip-auth.decorator';
import { UsersService } from 'src/user/users.service';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService, 
        private readonly usersService: UsersService,
        private readonly appLogger: AppLogger,
    ) {}

    @Public()
    @Post('/signup')
    signUp(@Body(ValidationPipe) userSignupInfoDto: SignupUserDto): Promise<any> {
        this.appLogger.log(`POST /auth/signup has been excuted.`);
        return this.authService.signUp(userSignupInfoDto);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async signIn(
        @Req() req: Request, 
        @Res({ passthrough: true }) res: Response
    ): Promise<User> {
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

        this.appLogger.log(`POST /auth/signin has been excuted.`);
        return user;
    }

    @Public()
    @UseGuards(JwtRefreshGuard)
    @Get('/refresh')
    refresh(
        @Req() req, 
        @Res({ passthrough: true }) res: Response
    ): User {
        const user = req.user;
        const {
            accessToken,
            ...accessOption
        } = this.authService.getCookieWithJwtAccessToken(user.id);
        res.cookie('Authentication', accessToken, accessOption);

        this.appLogger.log(`GET /auth/refresh has been excuted.`);
        return user;
    }

    @Public()
    @UseGuards(JwtRefreshGuard)
    @Post('/signout')
    async signOut(
        @Req() req,
        @Res({ passthrough: true }) res: Response
    ): Promise<void> {
        const {
            accessOption,
            refreshOption,
        } = this.authService.getCookiesForLogOut();

        await this.usersService.removeRefreshToken(req.user.id);

        res.clearCookie('Authentication', accessOption);
        res.clearCookie('Refresh', refreshOption);

        this.appLogger.log(`POST /auth/signout has been excuted.`);
    }

}
