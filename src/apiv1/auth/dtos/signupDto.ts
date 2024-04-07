import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { Match } from '../../utils/decorators/match.decorator';
import { IsUniqueEmail } from '../../utils/decorators/isUniqueEmail';

export default class SignupDto {
    @Length(6, 25, {message: 'Name must be between 6 and 25 characters long'})
    @IsString()
    name: string

    @IsUniqueEmail({ message: 'Email already exists' })
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

    @Match('password', { message: 'Passwords do not match' })
    @IsString()
    passwordConfirm?: string;
}
