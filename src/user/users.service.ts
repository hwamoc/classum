import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { SignupUserDto } from 'src/auth/dto/signup-user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { Email, Id } from './model/user.model';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private utilsService: UtilsService,
    ) {}

    async create(userSignupInfoDto: SignupUserDto): Promise<User> {
        const user: User = this.userRepository.create(userSignupInfoDto);
        await this.userRepository.save(user);
        return user;
    }

    async getOneBy(param: Id | Email): Promise<User> {
        const user = await this.userRepository.findOne(param);
        if (!user) {
            throw new NotFoundException(`User with this ${Object.keys(param)}: ${Object.values(param)} does not exist`);
        }
        return user;
    }

    async setCurrentRefreshToken(refreshToken: string, id: number) {
        const salt = await bcrypt.genSalt();
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        await this.userRepository.update(id, { currentHashedRefreshToken });
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
        const user = await this.getOneBy({ id });
    
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

    async updateProfile(user: User, image: Express.Multer.File) {
        const generatedFile: string = this.utilsService.uploadFile(image);
        const { affected } = await this.userRepository.update(user.id, {
            profileUrl: generatedFile,
        });
        if (affected === 0) {
            throw new NotFoundException(`User profile image uploading failed. User id: ${user.id}`);
        }
    }
}