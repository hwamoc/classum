import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/space-roles/role-type.enum';
import { SpaceRole } from 'src/space-roles/space-role.entity';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { getConnection, getManager } from 'typeorm';
import { UserToSpace } from '../user-to-spaces/user-to-space.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { Space } from './space.entity';
import { SpaceRepository } from './space.repository';

@Injectable()
export class SpacesService {
    constructor(
        @InjectRepository(SpaceRepository) 
        private spaceRepository: SpaceRepository,
        private usersService: UsersService,
        private utilsService: UtilsService,
    ) {}

    async getAllSpaces(
        user: User
    ): Promise<Space[]> {
        const mySpaces: Space[] = await this.spaceRepository.createQueryBuilder('s')
                .innerJoin(UserToSpace, 'uts', 'uts.space = s.id')
                .where('uts.userId = :id', { id: user.id })
                .getMany();

        return mySpaces;
    }

    async createSpace(
        createSpaceDto: CreateSpaceDto, 
        image: Express.Multer.File,
        user: User, 
    ): Promise<Space> {
        const queryRunner = await getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            if (image) {
                const generatedFile: string = this.utilsService.getFileUrl(image);
                createSpaceDto.logoUrl = generatedFile;
            }
            const userToSpaceTemp: UserToSpace = new UserToSpace();
            userToSpaceTemp.user = user;

            const { createSpaceRoleDtos } = createSpaceDto;
            const spaceRoles: SpaceRole[] = [];
            for (const spaceRoleDto of createSpaceRoleDtos) {
                const spaceRole: SpaceRole = new SpaceRole();
                spaceRole.roleName = spaceRoleDto.roleName;
                spaceRole.roleType = spaceRoleDto.roleType;
                spaceRoles.push(spaceRole);
            }

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

    async getSpace(id: number, user: User): Promise<Space> {
        const manager = getManager();

        const userRoleQb = await manager.createQueryBuilder()
                .subQuery()
                .from(UserToSpace, 'uts')
                .innerJoin(SpaceRole, 'sr', 'uts.spaceRoleId = sr.id')
                .select([
                    'uts.userId     AS userId',
                    'uts.spaceId    AS spaceId',
                    'uts.id         AS userToSpaceId',
                    'sr.id          AS spaceRoleId',
                    'sr.roleName    AS roleName',
                    'sr.roleType    AS roleType'
                ])
                .getQuery();

        const space = await this.spaceRepository.createQueryBuilder('s')
                .innerJoinAndSelect(userRoleQb, 'ur', 'ur.spaceId = s.id')
                .where('s.id = :id', { id })
                .andWhere('userId = :userId', { userId: user.id })
                .select([
                    's.id               AS id',
                    's.title            AS title',
                    's.logoUrl          AS logoUrl',
                    'ur.*'
                ])
                .getRawOne();

        if (!space) {
            throw new NotFoundException(`Can't find space with space id: ${id} and user id: ${user.id}`);
        }

        this.usersService.setCurrentSpaceNRole(space?.id, space?.roleType, user.id);
        return space;
    }

    async getSpaceById(id: number): Promise<Space> {
        const found = await this.spaceRepository.findOne(id);
        
        if (!found) {
            throw new NotFoundException(`Can't find Space with id ${id}`);
        }
        
        return found;
    }

    async deleteSpace(id: number): Promise<string> {
        const result = await this.spaceRepository.softDelete({ id });
        if (result.affected === 0) {
            throw new NotFoundException(`Can't delete Space with id ${id}`);
        }
        return 'successfully deleted';
    }
}