import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AppLogger } from 'src/common/logger/logger.service';
import { User } from 'src/user/user.entity';
import { multerImageOptions } from 'src/utils/multer-options';
import { ParseFormDataJsonPipe } from '../common/pipes/parse-form-data-json.pipe';
import { CreateSpaceBodyDto } from './dto/create-space-body.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceOwnerValidationPipe } from './pipes/space-owner-validation.pipe';
import { Space } from './space.entity';
import { SpacesService } from './spaces.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpacesController {
    constructor(
        private spacesService: SpacesService,
        private readonly appLogger: AppLogger,
    ) {}

    /*
    * 내가 속한 모든 공간 가져오기
    */
    @Get()
    getAllSpaces(
        @GetUser() user: User
    ): Promise<Space[]> {
        this.appLogger.log(`GET /spaces has been excuted.`);
        return this.spacesService.getAllSpaces(user);
    }

    /*
    * Postman으로 Request보낼 때 
    * 1. 로고 파일 포함하는 경우
    *   - form-data를 선택하고 json의 key 명은 'data'로 설정합니다.
    * 2. 로고 파일 미포함
    *   - raw/form-data 둘다 가능, raw json 전송시 'data'로 감싸 보냅니다. (nested validate)
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
    ): Promise<Space> {
        this.appLogger.log(`POST /spaces has been excuted.`);
        const createSpaceDto: CreateSpaceDto = (body as CreateSpaceBodyDto).data;
        return this.spacesService.createSpace(createSpaceDto, image, user);
    }

    @Get('/:id')
    getSpace(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Space> {
        this.appLogger.log(`GET /spaces/${id} has been excuted.`);
        return this.spacesService.getSpace(id, user);
    }

    @Delete('/:id')
    deleteSpace(
        @Param('id', SpaceOwnerValidationPipe) id: number,
    ): Promise<string> {
        this.appLogger.log(`DELETE /spaces/${id} has been excuted.`);
        return this.spacesService.deleteSpace(id);
    }
}