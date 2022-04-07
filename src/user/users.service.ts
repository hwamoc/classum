import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UserSignupInfoDto } from 'src/auth/dto/user-signup-info.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async create(userSignupInfoDto: UserSignupInfoDto): Promise<User> {
        const user: User = this.userRepository.create(userSignupInfoDto);
        await this.userRepository.save(user);
        return user;
    }

    async getById(id: number): Promise<User> {
        const user = this.userRepository.findOne({ id });
        if (!user) {
            throw new NotFoundException(`User with this id: ${id} does not exist`);
        }
        return user;
    }

    async getByEmail(email: string): Promise<User> {
        const user = this.userRepository.findOne({ email });
        if (!user) {
            throw new NotFoundException(`User with this email: ${email} does not exist`);
        }
        return user;
    }

    async setCurrentRefreshToken(refreshToken: string, id: number) {
        const salt = await bcrypt.genSalt();
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        await this.userRepository.update(id, { currentHashedRefreshToken });
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
        const user = await this.getById(id);
    
        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    
        if (isRefreshTokenMatching) {
            return user;
        }
    }

    async removeRefreshToken(id: number) {
        return this.userRepository.update(id, {
            currentHashedRefreshToken: null,
        });
    }
}