import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer-options';
import UtilsService from '../utils/utils.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private utilsService: UtilsService) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) userInfoDto: UserInfoDto): Promise<void> {
        return this.authService.signUp(userInfoDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }

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

    @Post('/authTest')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log('AUTH TEST>> user: ', user);
    }
}
