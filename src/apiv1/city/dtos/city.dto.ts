import { IsNotEmpty, IsString, Length } from "class-validator";
import { IsUniqueCityName } from "../../utils/decorators/isUniqueCityName";

export class cityDto {
    @Length(4, 15)
    @IsUniqueCityName({ message: 'City is already exists' })
    @IsString()
    @IsNotEmpty()
    name:string;
}