import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/space-roles/role-type.enum';
import { SpaceRole } from 'src/space-roles/space-role.entity';
import { User } from 'src/user/user.entity';
import UtilsService from 'src/utils/utils.service';
import { getConnection } from 'typeorm';
import { SpaceRolesService } from '../space-roles/space-roles.service';
import { UserToSpace } from '../user-to-spaces/user-to-space.entity';
import { UserToSpacesService } from '../user-to-spaces/user-to-spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { Space } from './space.entity';
import { SpaceRepository } from './space.repository';

@Injectable()
export class SpacesService {
    constructor(
        @InjectRepository(SpaceRepository) 
        private spaceRepository: SpaceRepository,
        private spaceRolesService: SpaceRolesService,
        private utilsService: UtilsService,
    ) {}

    async getAllSpaces(
        user: User
    ): Promise<Space[]> {
        const query = this.spaceRepository.createQueryBuilder('space');
        // 내가 참여하는 공간 가져오기
        // query.where('space.userId = :userId', { userId: user.id });

        const spaces = await query.getMany();

        return spaces;
    }

    async createSpace(
        createSpaceDto: CreateSpaceDto, 
        file: Express.Multer.File,
        user: User, 
    ): Promise<Space> {
        const queryRunner = await getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            if (file) {
                const generatedFile: string = this.utilsService.uploadFile(file);
                createSpaceDto.logoUrl = generatedFile;
            }
            const userToSpaceTemp: UserToSpace = new UserToSpace();
            userToSpaceTemp.user = user;
            const { createSpaceRoleDtos } = createSpaceDto;
            const spaceRoles: SpaceRole[] = this.spaceRolesService.buildSpaceRoles(createSpaceRoleDtos);
            const space: Space = await this.spaceRepository.buildSpace(createSpaceDto, userToSpaceTemp, spaceRoles, user);
            const savedSpace = await queryRunner.manager.save(space);

            const savedSpaceRoles: SpaceRole[]  = await queryRunner.manager.find(SpaceRole, { space: savedSpace });
            const savedUserToSpace: UserToSpace[] = await queryRunner.manager.find(UserToSpace, { user, space: savedSpace });
            const defulatAdminRole: SpaceRole = await savedSpaceRoles.find(r => r.roleType === RoleType.ADMIN);
            await queryRunner.manager.update(UserToSpace, savedUserToSpace[0].id, { spaceRoleId: defulatAdminRole.id });

            await queryRunner.commitTransaction();
            return savedSpace;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotFoundException(`Failed createSpace - ${error}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getSpaceById(id: number): Promise<Space> {
        const found = await this.spaceRepository.findOne(id);
        
        if (!found) {
            throw new NotFoundException(`Can't find Space with id ${id}`);
        }
        
        return found;
    }

    // 생성자만 공간을 삭제할 수 있다.
    async deleteSpace(id: number, user: User): Promise<void> {
        // const result = await this.spaceRepository.softDelete({ id, user });
        // if (result.affected === 0) {
            // throw new NotFoundException(`Can't find Space with id ${id}`);
        // }
    }
}