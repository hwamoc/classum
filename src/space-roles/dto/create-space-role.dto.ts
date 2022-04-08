import { RoleType } from "../role-type.enum";

export class CreateSpaceRoleDto {
    roleName: string;
    roleType: RoleType;
}