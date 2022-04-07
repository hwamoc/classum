import { Injectable } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import * as config from 'config';
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from '../../user/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.Authentication;
                },
            ]),
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jwt.access.secret'),
        })
    }

    async validate(payload: any) {
        return this.usersService.getById(payload.id);
    }
}