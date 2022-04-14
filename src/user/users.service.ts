import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { SignupUserDto } from 'src/auth/dto/signup-user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { Email, Id } from './model/user.model';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RoleType } from '../space-roles/role-type.enum';

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

    async getOnePrivateInfo(param: Id | Email): Promise<User> {
        let user: User;
        if ((param as Id).id) {
            user = await this.userRepository.createQueryBuilder('u')
            .select(['u.id', 'u.password', 'u.firstname', 'u.lastname', 'u.email', 'u.profileUrl', 'u.currentHashedRefreshToken', 'u.createdAt', 'u.updatedAt'])
            .where('u.id = :id', { id: (param as Id).id })
            .getOne();
        } else if ((param as Email).email) {
            user = await this.userRepository.createQueryBuilder('u')
            .select(['u.id', 'u.password', 'u.firstname', 'u.lastname', 'u.email', 'u.profileUrl', 'u.currentHashedRefreshToken', 'u.createdAt', 'u.updatedAt'])
            .where('u.email = :email', { email: (param as Email).email})
            .getOne();
        }

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

    async setCurrentSpaceNRole(currentSpaceId: number, currentRole: RoleType, id: number) {
        await this.userRepository.update(id, { currentSpaceId, currentRole });
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
        const user = await this.getOnePrivateInfo({ id });

        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user?.currentHashedRefreshToken);
        const { currentHashedRefreshToken, password, ...result } = user;
    
        if (isRefreshTokenMatching) {
            return result;
        }
    }

    async removeRefreshToken(id: number) {
        return this.userRepository.update(id, {
            currentHashedRefreshToken: null,
        });
    }

    async updateProfile(user: User, image: Express.Multer.File): Promise<string> {
        const generatedFile: string = this.utilsService.getFileUrl(image);
        const { affected } = await this.userRepository.update(user.id, {
            profileUrl: generatedFile,
        });
        if (affected === 0) {
            throw new NotFoundException(`User profile image uploading failed. User id: ${user.id}`);
        }
        return 'successfully updated';
    }
}