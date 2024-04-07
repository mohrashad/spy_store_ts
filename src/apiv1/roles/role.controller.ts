import { Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, UseInterceptor } from "routing-controllers";
import { Service } from "typedi";
import { RoleService } from "./role.service";
import { RoleDto } from "./dtos/role.dto";
import { Role } from "../interfaces/role";
import { RoleInterceptor } from "./interceptors/roles.interceptor";
import { CreateRoleInterceptor } from "./interceptors/createRole.interceptor";

@Service()
@JsonController('/roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get('/')
    @UseInterceptor(RoleInterceptor)
    @Authorized(['admin'])
    async findAll(): Promise<Role[]> {
        return await this.roleService.find();
    }
    
    @Post('/')
    @UseInterceptor(CreateRoleInterceptor)
    @Authorized(['admin'])
    async create(@Body() createRoleDto:RoleDto):Promise<Role> {
        return await this.roleService.create(createRoleDto);
    }

    @Patch('/:roleId')
    @UseInterceptor(CreateRoleInterceptor)
    @Authorized(['admin'])
    async update(@Param('roleId') roleId:string, @Body() createRoleDto:Partial<RoleDto>):Promise<Role> {
        return await this.roleService.update(roleId, createRoleDto);
    }

    @Delete('/:roleId')
    @OnUndefined(204)
    @Authorized(['admin'])
    async delete(@Param('roleId') roleId:string): Promise<void> {
        await this.roleService.delete(roleId);
    }
}