import { CreateSpaceRoleDto } from "src/space-roles/dto/create-space-role.dto";

export class CreateSpaceDto {
    title: string;
    logoUrl: string;
    createSpaceRoleDtos: CreateSpaceRoleDto[];
}