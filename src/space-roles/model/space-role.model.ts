import { RoleType } from "../role-type.enum";

export class MatchedRoleType {
    roleType: RoleType;
    constructor(roleCode: string) {
        const roleStr: string = roleCode.split('Code')[0].toUpperCase();
        switch (roleStr) {
            case 'ADMIN': this.roleType = RoleType.ADMIN; break;
            case 'PARTICIPANT': this.roleType = RoleType.PARTICIPANT; break;
            default: break;
        }
    }
}