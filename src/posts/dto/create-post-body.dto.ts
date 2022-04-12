import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class CreatePostBodyDto {
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreatePostDto)
    data: CreatePostDto;
}