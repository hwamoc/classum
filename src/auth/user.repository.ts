import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UserInfoDto } from './dto/user-info.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    async createUser(userInfoDto: UserInfoDto): Promise<void> {
        const { email, firstname, lastname, password } = userInfoDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user: User = this.create({ email, firstname, lastname, password: hashedPassword });

        try {
            await this.save(user);
        } catch (error) {
            console.log('error', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Existing email');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}