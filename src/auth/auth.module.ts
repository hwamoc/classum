import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import UtilsService from 'src/utils/utils.service';
import { UsersModule } from '../user/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.access.secret,
      signOptions: {
        expiresIn: jwtConfig.access.expiresIn,
      }
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, UtilsService],
  exports: [AuthService, JwtModule, PassportModule]
})
export class AuthModule {}
