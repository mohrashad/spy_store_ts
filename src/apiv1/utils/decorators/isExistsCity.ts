import { Inject } from 'typedi';
import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import { CityService } from '../../city/city.service';

export function IsExistsCity(validationOptions?: ValidationOptions) {
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

@ValidatorConstraint({name: 'IsExistsCity'})
export class MatchConstraint implements ValidatorConstraintInterface {
    @Inject() private readonly cityService:CityService
    constructor() { this.cityService = new CityService() }
    async validate(value: string, args: ValidationArguments):Promise<any> {
        const city = await this.cityService.findById(value)
       
        if (city) return true
        return false
    }
}