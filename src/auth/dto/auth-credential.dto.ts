import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @IsEmail({}, { message: 'Incorrect email' })
    @IsNotEmpty({ message: 'The email is required' })
    email: string;

    @IsString()
    @Matches(/^[a-zA-Z0-9!@#$%^&*]*$/, { message: 'The Password only accepts english, number and special character !@#$%^&*' })
    @Length(6, 30, { message: 'The password must be at least 6 but not longer than 30 characters' })
    @IsNotEmpty({ message: 'The password is required' })
    password: string;
}