import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as config from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/user/users.service';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: config.get('jwt.refresh.secret'),
            passReqToCallback: true,
        })
    }

    async validate(req, payload: any) {
        const refreshToken = req.cookies?.Refresh;
        return this.usersService.getUserIfRefreshTokenMatches(
            refreshToken,
            payload.id,
        );
    }
}