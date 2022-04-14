import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AppLogger } from 'src/common/logger/logger.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { RoleType } from './role-type.enum';
import { SpaceRole } from './space-role.entity';
import { SpaceRolesService } from './space-roles.service';

@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpaceRolesController {
    constructor(
        private spaceRolesService: SpaceRolesService,
        private readonly appLogger: AppLogger,
    ) {}

    @Get('/:spaceId/space-roles')
    getAllSpaceRoles(
        @Param('spaceId', ParseIntPipe) spaceId: number,
    ): Promise<SpaceRole[]> {
        this.appLogger.log(`GET /spaces/${spaceId}/space-roles has been excuted.`);
        return this.spaceRolesService.getAllSpaceRoles(spaceId);
    }

    /*
    * 공간 역할 생성 (관리자 가능)
    */
    @Post('/:spaceId/space-roles')
    @Roles(RoleType.ADMIN)
    @UseGuards(RolesGuard)
    createSpaceRole(
        @Param('spaceId', ParseIntPipe) spaceId: number,
        @Body() createSpaceRoleDtos: CreateSpaceRoleDto[]
    ): Promise<SpaceRole[]> {
        this.appLogger.log(`POST /spaces/${spaceId}/space-roles has been excuted.`);
        return this.spaceRolesService.createSpaceRole(spaceId, createSpaceRoleDtos);
    }

    /*
    * 공간 역할 삭제 (관리자 가능)
    */
    @Delete('/space-roles/:id')
    @Roles(RoleType.ADMIN)
    @UseGuards(RolesGuard)
    deleteSpaceRole(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<string> {
        this.appLogger.log(`POST /spaces/space-roles/${id} has been excuted.`);
        return this.spaceRolesService.deleteSpaceRole(id);
    }
}
