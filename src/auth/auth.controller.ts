import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/skip-auth.decorator';
import { UsersService } from 'src/user/users.service';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService, 
        private readonly usersService: UsersService,
    ) {}

    @Public()
    @Post('/signup')
    signUp(@Body(ValidationPipe) userSignupInfoDto: SignupUserDto): Promise<any> {
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
    @Post('/authTest')
    test(@GetUser() user: User) {
        console.log('AUTH TEST>> user: ', user);
        return user;
    }
}
