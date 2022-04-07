import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/skip-auth.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    authService: any;
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Get(':email')
    findOneByEmail(@Param() email: string): Promise<User> {
        return this.usersService.getByEmail(email);
    }
}