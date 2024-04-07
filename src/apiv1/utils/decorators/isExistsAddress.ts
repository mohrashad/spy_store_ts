import { Inject } from 'typedi';
import { AddressService } from '../../address/address.service';
import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

export function IsExistsAddress(validationOptions?: ValidationOptions) {
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

@ValidatorConstraint({name: 'IsExistsAddress'})
export class MatchConstraint implements ValidatorConstraintInterface {
    @Inject() private readonly addressService:AddressService
    constructor() { this.addressService = new AddressService() }
    async validate(value: string, args: ValidationArguments):Promise<any> {
        const address = await this.addressService.findById(value)
       
        if (address) return true
        return false
    }
}