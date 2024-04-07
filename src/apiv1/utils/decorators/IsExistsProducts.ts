import { Inject } from 'typedi';
import { ProductService } from '../../product/product.service';
import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

export function IsExistsProduct(validationOptions?: ValidationOptions) {
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

@ValidatorConstraint({name: 'IsExistsProduct'})
export class MatchConstraint implements ValidatorConstraintInterface {
    @Inject() private readonly productService:ProductService
    constructor() { this.productService = new ProductService() }
    async validate(value: string, args: ValidationArguments):Promise<any> {
        const product = await this.productService.findById(value)
       
        if (product) return true
        return false
    }
}