import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class UserInfoDto {
    @IsString()
    @IsEmail({}, { message: 'Incorrect email' })
    @IsNotEmpty({ message: 'The email is required' })
    email: string;

    @IsString()
    @Matches(/^[a-zA-Z0-9!@#$%^&*]*$/, { message: 'The Password only accepts english, number and special character !@#$%^&*' })
    @Length(6, 30, { message: 'The password must be at least 6 but not longer than 30 characters' })
    @IsNotEmpty({ message: 'The password is required' })
    password: string;

    @IsString()
    @Matches(/^[가-힣a-z]+(?:['_.\s][a-z]+)*$/i, { message: 'Only english, korean, and some specail character \'_. possible. Firstname  can\'t start or end with \' _ . and space' })
    @Length(1, 50, { message: 'There must be 1 to 50 chars in the string' })
    @IsNotEmpty({ message: 'The firstname is required' })
    firstname: string;

    @IsString()
    @Matches(/^[가-힣a-z]+(?:['_.\s][a-z]+)*$/i, { message: 'Only english, korean, and some specail character \'_. possible. Lastname can\'t start or end with \' _ . and space' })
    @Length(1, 50, { message: 'There must be 1 to 50 chars in the string' })
    @IsNotEmpty({ message: 'The lastname is required' })
    lastname: string;
}