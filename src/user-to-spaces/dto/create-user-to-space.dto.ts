import { Length, Matches } from "class-validator";

export class CreateUserToSpaceDto {
    @Length(8, 8, { message: 'There must be 8 chars in the string' })
    @Matches(/^[a-zA-Z0-9]*$/, { message: 'The code only accepts english and number'})
    code: string;
}