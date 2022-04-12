import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { RoleType } from 'src/space-roles/role-type.enum';
import { User } from 'src/user/user.entity';
import { EntityManager, getManager } from 'typeorm';
import { PostStatus } from '../model/post-status.enum';
import { PostType } from '../model/post-type.enum';

@ValidatorConstraint({ name: 'PostStatusValidation', async: true })
export class PostStatusValidation implements ValidatorConstraintInterface {
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
        const type: string = JSON.parse(JSON.stringify(args.object)).postType?.toUpperCase();
        const status: string = value?.toUpperCase();

        const id: number = JSON.parse(JSON.stringify(args.object)).userId;
        const role: string = await this.getUserRole(id);

        if (PostType[type] === PostType.QUESTION && this.isStatusValid(status)) {       // 게시글이 타입이 질문인 경우, 익명 또는 공개 상태로 작성할 수 있다.
            if (PostStatus[status] === PostStatus.PRIVATE && RoleType[role] === RoleType.PARTICIPANT) {    // 사용자의 역할이 참여자일 경우만 익명으로 작성할 수 있다.
                return true;
            } else if (PostStatus[status] === PostStatus.PUBLIC) {
                return true;
            }
            return false;
        } else if (PostType[type] === PostType.NOTICE && !status) { 
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
        const type: string = JSON.parse(JSON.stringify(args.object)).postType?.toUpperCase();
        const status: string = JSON.parse(JSON.stringify(args.object)).status;
        if (PostType[type] === PostType.QUESTION) {
            if (!status) {
                return 'Status is required. [status option: private, public]';
            } 
            return `There is two post status options: private, public. Admin can't select private.`;
        } else if (PostType[type] === PostType.NOTICE) {
            return `If post type is notice, don't enter post status.`;
        } else {
            return 'Post type is required.';
        }
    }
}
