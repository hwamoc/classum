import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as config from 'config';
import { UsersService } from '../user/users.service';
import { UserSignupInfoDto } from './dto/user-signup-info.dto';
import { AuthCookie, RefreshCookie, CookieClearOption } from './model/auth-model';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {}

    // TODO: password 없는 user dto 만들기
    async vaildateUser(email: string, plainTextPassword: string): Promise<any> {        
        const user = await this.usersService.getByEmail(email);
        const verified = await this.verifyPassword(plainTextPassword, user.password);
        if (user && verified) {
            const { password, ...result } = user;
            return result;
        } else {
            throw new BadRequestException('Wrong credentials provided');
        }
    }

    private async verifyPassword(
        plainTextPassword: string, 
        hashedPassword: string
    ): Promise<boolean> {
        const isPasswordMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatch) {
            throw new BadRequestException('Worng credentials provided')
        }
        return isPasswordMatch;
    }

    // TODO: user 반환 dto 만들기
    async signUp(userSignupInfoDto: UserSignupInfoDto): Promise<any> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userSignupInfoDto.password, salt);
        try {
            const { password, ...returnUser } = await this.usersService.create({ ...userSignupInfoDto, password: hashedPassword });
            return returnUser;
        } catch (error) {
            if (error?.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Existing email');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    getCookieWithJwtAccessToken(id: number) {
        const payload = { id };
        const accessTokenConfig = config.get('jwt.access');
        const jwtAccessTokenOption = {
            secret: accessTokenConfig.secret,
            expiresIn: `${accessTokenConfig.expiresIn}s`,
        }
        const accessToken = this.jwtService.sign(payload, jwtAccessTokenOption);
    
        const authCookie: AuthCookie = new AuthCookie({
            accessToken,
            maxAge: accessTokenConfig.expiresIn * 1000,
        });
        return authCookie;
    }
    
    getCookieWithJwtRefreshToken(id: number) {
        const payload = { id };
        const refreshTokenConfig = config.get('jwt.refresh');
        const jwtRefreshTokenOption = {
            secret: refreshTokenConfig.secret,
            expiresIn: `${refreshTokenConfig.expiresIn}s`,
        }
        const refreshToken = this.jwtService.sign(payload, jwtRefreshTokenOption);
    
        const refreshCookie: RefreshCookie = new RefreshCookie({
            refreshToken,
            maxAge: refreshTokenConfig.expiresIn * 1000,
        });
        return refreshCookie;
    }
    
    getCookiesForLogOut() {
        const cookieClearOption: CookieClearOption = new CookieClearOption();
        return {
            accessOption: cookieClearOption,
            refreshOption: cookieClearOption,
        };
    }
}
