import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { multerImageOptions } from 'src/utils/multer-options';
import { ParseFormDataJsonPipe } from '../common/pipes/parse-form-data-json.pipe';
import { CreateSpaceBodyDto } from './dto/create-space-body.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { Space } from './space.entity';
import { SpacesService } from './spaces.service';

@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpacesController {
    constructor(private spacesService: SpacesService) {}

    @Get()
    getAllSpaces(
        @GetUser() user: User
    ): Promise<Space[]> {
        return this.spacesService.getAllSpaces(user);
    }

    /*
    * Postman으로 Request보낼 때 
    * 1. 로고 파일 포함하는 경우
    *   - form-data를 선택하고 json의 key 명은 'data'로 설정합니다.
    * 2. 로고 파일 미포함
    *   - raw/form-data 둘다 가능 (Content-Type: application/json)
    */
    @Post()
    @UseInterceptors(FileInterceptor('file', multerImageOptions))
    createSpace(
        @Body(
            new ParseFormDataJsonPipe({ except: ['file'] }),
            new ValidationPipe(),
        ) body: CreateSpaceBodyDto,
        @UploadedFile() image: Express.Multer.File,
        @GetUser() user: User
    ) {
        const createSpaceDto: CreateSpaceDto = (body as CreateSpaceBodyDto).data;
        return this.spacesService.createSpace(createSpaceDto, image, user);
    }

    @Get('/:id')
    getSpace(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Space> {
        return this.spacesService.getSpace(id, user);
    }

    // @Post('/logo')
    // @UseInterceptors(FileInterceptor('file', multerOptions))
    // updateProfile(
    //     @GetUser() user: User,
    //     @UploadedFile() file: Express.Multer.File,
    // ): Promise<void> {
    //     return this.usersService.updateProfile(user, file);
    //     // TODO: 응답 형태 통일
    // }

    @Delete('/:id')
    deleteSpace(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.spacesService.deleteSpace(id, user);
    }
}