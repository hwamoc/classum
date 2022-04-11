import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateUserToSpaceDto {
    @IsString()
    @Length(8, 8, { message: 'There must be 8 chars in the string' })
    @Matches(/^[a-zA-Z0-9]*$/, { message: 'The code only accepts english and number'})
    @IsNotEmpty({ message: 'The code is required' })
    code: string;
}