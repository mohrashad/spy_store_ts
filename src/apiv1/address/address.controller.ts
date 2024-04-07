import { Authorized, Body, Delete, Get, JsonController, NotFoundError, OnUndefined, Param, Patch, Post, Req, UseInterceptor } from "routing-controllers";
import { Service } from "typedi";
import { AddressService } from "./address.service";
import { Address } from "../interfaces/address";
import { CustomRequest } from "../interfaces/Request";
import { PaginationInfo } from "../utils/decorators/paginationInfo";
import { PaginationQueryParam } from "../interfaces/paginationQueryParam";
import { CreateAdressDto } from "./dtos/createAddressDto";
import { AddressInterceptor } from "./interceptors/address.interceptor";
import { CreateAddressInterceptor } from "./interceptors/createAddress.interceptor";

@Service()
@JsonController('/addresses')
export class AddressController {
    constructor(private readonly adressService:AddressService) {}

    @Get('/')
    @Authorized(['admin'])
    @UseInterceptor(AddressInterceptor)
    async getAllAddresses(@PaginationInfo() paginationInfo:PaginationQueryParam):Promise<Address[]> {
        const adresses:Address[] = await this.adressService.find(paginationInfo);
        return adresses;
    }

    @Get('/user')
    @Authorized(['user', 'admin'])
    @UseInterceptor(AddressInterceptor)
    async getUserAddresses(@PaginationInfo() paginationInfo:PaginationQueryParam, @Req() req:CustomRequest):Promise<Address[]> {
        const userId = req.user.id
        const adresses:Address[] = await this.adressService.find(paginationInfo, userId);
        return adresses;
    }

    @Get('/:addressId')
    @Authorized(['user', 'admin'])
    @UseInterceptor(AddressInterceptor)
    async getAddressById(@Param('addressId') addressId:string):Promise<Address | null> {
        const adress:Address|null = await this.adressService.findById(addressId)

        if (adress) return adress;
        throw new NotFoundError('address not found')
    }

    @Post('/')
    @Authorized(['user', 'admin'])
    @UseInterceptor(CreateAddressInterceptor)
    async create(@Req() req:CustomRequest, @Body() createAddressDto:CreateAdressDto):Promise<object> {
        return await this.adressService.create(req.user.cuid, createAddressDto)
    }

    @Patch('/:addressId')
    @Authorized(['user', 'admin'])
    @UseInterceptor(CreateAddressInterceptor)
    async update(@Req() req:CustomRequest, @Param('addressId') addressId:string, @Body() updateAddressDto:Partial<CreateAdressDto>):Promise<object> {
        return await this.adressService.update(addressId, updateAddressDto)
    }

    @Delete('/:addressId')
    @OnUndefined(204)
    @Authorized(['user', 'admin'])
    async delete(@Param('addressId') addressId:string):Promise<void> {
        await this.adressService.delete(addressId)
    }
}