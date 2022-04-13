import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { RoleType } from './role-type.enum';
import { SpaceRole } from './space-role.entity';
import { SpaceRolesService } from './space-roles.service';

@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpaceRolesController {
    constructor(private spaceRolesService: SpaceRolesService) {}

    @Get('/:spaceId/space-roles')
    getAllSpaceRoles(
        @Param('spaceId', ParseIntPipe) spaceId: number,
    ): Promise<SpaceRole[]> {
        return this.spaceRolesService.getAllSpaceRoles(spaceId);
    }

    @Post('/:spaceId/space-roles')
    @Roles(RoleType.ADMIN)
    @UseGuards(RolesGuard)
    createSpaceRole(
        @Param('spaceId', ParseIntPipe) spaceId: number,
        @Body() createSpaceRoleDtos: CreateSpaceRoleDto[]
    ): Promise<SpaceRole[]> {
        return this.spaceRolesService.createSpaceRole(spaceId, createSpaceRoleDtos);
    }

    @Delete('/:spaceId/space-roles/:id')
    @Roles(RoleType.ADMIN)
    @UseGuards(RolesGuard)
    deleteSpaceRole(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<string> {
        return this.spaceRolesService.deleteSpaceRole(id);
    }
}
