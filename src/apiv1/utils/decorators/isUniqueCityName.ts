import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import { Inject } from 'typedi';
import { CityService } from '../../city/city.service';

export function IsUniqueCityName(validationOptions?: ValidationOptions) {
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

@ValidatorConstraint({name: 'IsUniqueCityName'})
export class MatchConstraint implements ValidatorConstraintInterface {
    @Inject() private readonly cityService:CityService
    constructor() { this.cityService = new CityService() }
    async validate(value: string, args: ValidationArguments):Promise<any> {
        const city = await this.cityService.findByName(value)
       
        if (city) return false
        return true
    }
}