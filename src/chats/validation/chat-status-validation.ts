import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PostStatus } from 'src/posts/model/post-status.enum';
import { RoleType } from 'src/space-roles/role-type.enum';
import { User } from 'src/user/user.entity';
import { EntityManager, getManager } from 'typeorm';

@ValidatorConstraint({ name: 'ChatStatusValidation', async: true })
export class ChatStatusValidation implements ValidatorConstraintInterface {
    constructor(
        private entityManager: EntityManager,
    ) {
        this.entityManager = getManager();
    }

    readonly StatusOptions = [
        PostStatus.PRIVATE,
        PostStatus.PUBLIC
    ]

    async validate(value: any, args: ValidationArguments) {
        const status: string = value?.toUpperCase();

        const id: number = JSON.parse(JSON.stringify(args.object)).userId;
        const role: string = await this.getUserRole(id);
        console.log('role', id, role)
        if (this.isStatusValid(status)) {
            if (PostStatus[status] === PostStatus.PRIVATE && RoleType[role] === RoleType.ADMIN) {    // 사용자의 역할이 참여자일 경우만 익명으로 작성할 수 있다.
                return false;
            }
            return true;
        }
        return false;
    }

    private isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1;
    }

    private async getUserRole(id: number): Promise<string> {
        const user: User = await this.entityManager.createQueryBuilder()
                .from(User, 'u')
                .where('u.id = :id', { id })
                .select(['u.currentRole'])
                .getOne();
        return user.currentRole;
    }

    defaultMessage(args: ValidationArguments) {
        const status: string = JSON.parse(JSON.stringify(args.object)).status;

        if (!status) {
            return 'Status is required. [status option: private, public]';
        } 
        if (!this.isStatusValid(status)) {
            return `There is two post status options: private, public. Admin can't select private.`;
        }
    }
}
