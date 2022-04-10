import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/skip-auth.decorator';
import { User } from 'src/user/user.entity';
import { multerOptions } from 'src/utils/multer-options';
import { CreateSpaceDto } from './dto/create-space.dto';
import { Space } from './space.entity';
import { SpacesService } from './spaces.service';

@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpacesController {
    constructor(private spacesService: SpacesService) {}

    @Get('/')
    @Public() //테스트 끝나고 지워야 해
    getAllSpace(
        @GetUser() user: User
    ): Promise<Space[]> {
        return this.spacesService.getAllSpaces(user);
    }

    /*
    * Postman으로 Request보낼 때 
    * 1. 로고 파일 포함하는 경우
    *   - form-data를 선택하고 json의 key 명은 'body'로 설정해야 합니다. (JSON으로 파싱할 때 data.body로 접근함)
    * 2. 로고 파일 미포함
    *   - 보통 요청시와 동일하게 raw로 json을 보내면 됩니다. (Content-Type: application/json)
    */
    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    createSpace(
        @Body() data: any,
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: User
    ) {
        const createSpaceDto: CreateSpaceDto = file ? JSON.parse(data.body) : data
        return this.spacesService.createSpace(createSpaceDto, file, user);
    }

    @Get('/:id')
    getSpaceById(@Param('id', ParseIntPipe) id: number): Promise<Space> {
        return this.spacesService.getSpaceById(id);
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