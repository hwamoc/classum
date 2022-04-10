import { IsNotEmpty } from "class-validator";
import { CreateSpaceRoleDto } from "src/space-roles/dto/create-space-role.dto";

export class CreateSpaceDto {
    @IsNotEmpty({ message: 'The title is required' })
    title: string;
    logoUrl: string;
    @IsNotEmpty({ message: 'The space role is required' })
    createSpaceRoleDtos: CreateSpaceRoleDto[];
}