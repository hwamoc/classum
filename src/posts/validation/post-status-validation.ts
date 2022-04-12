import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PostStatus } from '../model/post-status.enum';
import { PostType } from '../model/post-type.enum';

@ValidatorConstraint({ name: 'PostStatusValidation', async: false })
export class PostStatusValidation implements ValidatorConstraintInterface {

    readonly StatusOptions = [
        PostStatus.PRIVATE,
        PostStatus.PUBLIC
    ]

    validate(value: any, args: ValidationArguments) {
        const type: string = JSON.parse(JSON.stringify(args.object)).postType?.toUpperCase();
        const status: string = JSON.parse(JSON.stringify(args.object)).status?.toUpperCase();
        if (PostType[type] === PostType.QUESTION && this.isStatusValid(status)) {
            return true;             
        } else if (PostType[type] === PostType.NOTICE && !status) {
            return true;
        }
        return false;
    }

    private isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1;
    }

    defaultMessage(args: ValidationArguments) {
        const type: string = JSON.parse(JSON.stringify(args.object)).postType?.toUpperCase();
        const status: string = JSON.parse(JSON.stringify(args.object)).status;
        if (PostType[type] === PostType.QUESTION) {
            if (!status) {
                return 'Status is required. [status option: private, public]';
            } 
            return 'There is two post status options: private, public.';
        } else if (PostType[type] === PostType.NOTICE) {
            return `If post type is notice, don't need to enter post status.`;
        } else {
            return 'Post type is required.';
        }
    }
}
