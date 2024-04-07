import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export default class LoginDto {
    @IsEmail()
    @IsString({ message: 'Email must be a string' })
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    @IsString()
    password: string;
}
