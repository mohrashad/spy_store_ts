import { IsNotEmpty, IsString, Length } from "class-validator";

export class RoleDto {
    @Length(3, 15)
    @IsString()
    @IsNotEmpty()
    name : string;

    @Length(10, 20)
    @IsString()
    @IsNotEmpty()
    description : string;
}