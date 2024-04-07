import { IsNotEmpty, IsString, Length } from "class-validator";
import { IsValidCuid } from "../../utils/decorators/isValidCuid";
import { IsExistsCity } from "../../utils/decorators/isExistsCity";

export class CreateAdressDto {
    @IsString()
    @IsNotEmpty()
    @Length(8, 50)
    title: string;

    @IsString()
    @IsNotEmpty()
    @IsValidCuid({ message: 'invalid id format' })
    @IsExistsCity({ message: 'invalid city or not found' })
    cityId: string;
}