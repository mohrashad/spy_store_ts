import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

export function IsValidCuid(validationOptions?: ValidationOptions) {
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

@ValidatorConstraint({ name: 'IsValidCuid' })
export class MatchConstraint implements ValidatorConstraintInterface {
    async validate(value: string, args: ValidationArguments): Promise<any> { 
     const cuidRegex = /^c[a-z0-9]{24}$/
        
        return cuidRegex.test(value)
    }
}