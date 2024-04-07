import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class ProductDto {
    @Length(8, 20, { message: 'Product name must between 8 and 20 characters length' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    price: number;

    @Length(6, 20, { message: 'Product category must between 6 and 20 characters length' })
    @IsString()
    @IsNotEmpty()
    category: string;
    
    @Length(80, 300, { message: 'Product description must between 80 and 300 characters length' })
    @IsString()
    @IsNotEmpty()
    description: string;
}
