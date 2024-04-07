import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { IsValidCuid } from "../../utils/decorators/isValidCuid";

export class UpdateUserRolesDto {
    @IsValidCuid({ each: true, message: 'ivalid id formats' })
    @IsString({ each: true, message: 'roles must be an array of strings' })
    @IsArray({ message: 'roles must be an array' })
    @IsNotEmpty({ message: 'roles is required' })
    roles: string[];

    @IsValidCuid({ message: 'invalid user id format' })
    @IsString({ message: 'user id must be a string' })
    @IsNotEmpty({ message: 'user id is required' })
    userId: string;
}