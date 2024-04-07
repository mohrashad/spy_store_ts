import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import { Inject } from 'typedi';
import { UserService } from '../../user/user.service';

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: MatchConstraint,
        });
    };
}

@ValidatorConstraint({name: 'IsUniqueEmail'})
export class MatchConstraint implements ValidatorConstraintInterface {
    @Inject() private readonly userService:UserService
    constructor() { this.userService = new UserService() }
    async validate(value: string, args: ValidationArguments):Promise<any> {
        const user = await this.userService.getByEmail(value)
       
        if (user) return false
        return true
    }
}