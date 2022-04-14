import { IsNotEmpty, IsNumber, IsString, Length, Validate } from "class-validator";
import { PostStatusValidation } from "../validation/post-status-validation";
import { PostTypeValidation } from "../validation/post-type-validation";

export class CreatePostDto {
    @IsNotEmpty({ message: 'The postType is required' })
    @Validate(PostTypeValidation)
    postType: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty({ message: 'The title is required' })
    @Length(1, 50, { message: 'There must be 1 to 50 chars in the string' })
    title: string;

    @IsString()
    content: string;

    @Validate(PostStatusValidation)
    status: string;
}