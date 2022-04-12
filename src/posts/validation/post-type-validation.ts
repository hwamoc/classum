import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PostType } from '../model/post-type.enum';

@ValidatorConstraint({ name: 'PostTypeValidation', async: false })
export class PostTypeValidation implements ValidatorConstraintInterface {

    readonly TypeOptions = [
        PostType.NOTICE,
        PostType.QUESTION
    ]

    validate(value: any, args: ValidationArguments) {
        const postType: PostType = JSON.parse(JSON.stringify(args.object)).postType?.toUpperCase();
        if (this.isTypeValid(postType)) {
            return true;             
        }
        return false;
    }

    private isTypeValid(type: any) {
        const index = this.TypeOptions.indexOf(type);
        return index !== -1;
    }

    defaultMessage(args: ValidationArguments) {
        return `There is two post type options: notice, question.`;
    }
}
