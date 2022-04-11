import { IsNotEmpty, IsString } from "class-validator";
import { RoleType } from "../role-type.enum";

export class CreateSpaceRoleDto {
    @IsString()
    @IsNotEmpty({ message: 'The roleName is required' })
    roleName: string;

    @IsNotEmpty({ message: 'The roleType is required' })
    roleType: RoleType;
}