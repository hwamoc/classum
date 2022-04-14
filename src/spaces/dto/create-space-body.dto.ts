import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { CreateSpaceDto } from './create-space.dto';
export class CreateSpaceBodyDto {
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreateSpaceDto)
    data: CreateSpaceDto;
}