import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { CreateUserToSpaceDto } from './dto/create-user-to-space.dto';
import { UserToSpace } from './user-to-space.entity';
import { UserToSpacesService } from './user-to-spaces.service';

@Controller('spaces/user-to-spaces')
@UseGuards(JwtAuthGuard)
export class UserToSpacesController {
    constructor(private userToSpacesService: UserToSpacesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createUserToSpace(
        @Body() createUserToSpaceDto: CreateUserToSpaceDto,
        @GetUser() user: User
    ): Promise<UserToSpace> {
        return this.userToSpacesService.createUserToSpace(createUserToSpaceDto, user);
    }
}
