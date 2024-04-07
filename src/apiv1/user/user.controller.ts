import { Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Patch } from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "./user.service";
import { IUser } from "../interfaces/IUser";
import { UpdateUserRolesDto } from "./dtos/updateRoles.dto";

@Service()
@Authorized(['admin'])
@JsonController('/users')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get('/')
    async getAllUsers(): Promise<IUser[]> {
        return await this.userService.findAll();
    }

    @Get('/:userId')
    async getUserById(@Param('userId') userId: string): Promise<IUser | null> {
        return await this.userService.findByCuid(userId.toString());
    }

    @Patch('/roles')
    @Authorized(['admin'])
    async updateUser(@Body() updateUserDto:UpdateUserRolesDto): Promise<IUser> {
        return await this.userService.updateUserRoles(updateUserDto.userId, updateUserDto);
    }

    @Delete('/:userId')
    @OnUndefined(204)
    async deleteUser(@Param('userId') userId: string): Promise<void> {
        await this.userService.delete(userId.toString());
    }
}