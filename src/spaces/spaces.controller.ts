import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/skip-auth.decorator';
import { User } from 'src/user/user.entity';
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

    @Post()
    @UsePipes(ValidationPipe)
    createSpace(
        @Body() createSpaceDto: CreateSpaceDto,
        @GetUser() user: User
    ): Promise<Space> {
        return this.spacesService.createSpace(createSpaceDto, user);
    }

    @Get('/:id')
    getSpaceById(@Param('id', ParseIntPipe) id: number): Promise<Space> {
        return this.spacesService.getSpaceById(id);
    }

}