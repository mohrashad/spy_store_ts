import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { IsValidCuid } from "../../utils/decorators/isValidCuid"

export class OrderItemDto {
    @IsString()
    @IsValidCuid({ message: 'invalid id fromat' })
    @IsNotEmpty()
    productId: number

    @IsNumber()
    @IsNotEmpty()
    amount: number
}