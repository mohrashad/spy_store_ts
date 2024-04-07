import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsValidCuid } from "../../utils/decorators/isValidCuid";
import { IsExistsProduct } from "../../utils/decorators/IsExistsProducts";

export class CartItemDto {
    @IsString()
    @IsNotEmpty()
    @IsValidCuid({ message: 'invalid id format' })
    @IsExistsProduct({ message: 'invalid product or not found' })
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}