import { Prisma, PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { PaginationQueryParam } from "../interfaces/paginationQueryParam";
import { Address } from "../interfaces/address";
import { prismaClient } from "../utils/prismaClient";

@Service()
export class AddressService {
    private prisma: PrismaClient;
    constructor() { this.prisma = prismaClient }

    async find(paginationInfo:PaginationQueryParam, userId?: number):Promise<Address[]>{
        let { id:cursor } = await this.prisma.address.findFirst({select: { id:true }, orderBy: { id: 'desc' } }) || {}
        if (paginationInfo.cursor && cursor && cursor > paginationInfo.cursor) cursor =  paginationInfo.cursor;

        const where:Prisma.AddressWhereInput = {};
        if (userId)  where['userId'] = userId;

        const addressess =  await this.prisma.address.findMany({
            where,
            take: paginationInfo.limit,
            cursor: {id: cursor},
            select: { cuid:true, title: true, city: { select: { name: true } } },
            orderBy: { id: 'desc' }
        })

        await this.disconnectDatabase();
        return addressess;
    }

    async findById(addressId: string):Promise<Address | null>{
        const address =  await this.prisma.address.findUnique({
            where: { cuid: addressId },
            select: { cuid: true, title: true, city: { select: { name: true } } }
        })

        await this.disconnectDatabase();
        return address;
    }

    async userAddressCount(userId: number):Promise<number> {
        const userAddressCount = await this.prisma.address.count({
            where: { userId },
            orderBy: { id: 'desc' }
        })

        await this.disconnectDatabase();
        return userAddressCount;
    }

    async create(userId: string, address:Address): Promise<object> {
        const addressData:Prisma.AddressCreateInput = {
            title: address.title,
            user: {connect: { cuid: userId }},
            city: {connect: { cuid: address.cityId }}
        }

        const newAddress = await this.prisma.address.create({ data: addressData });
        await this.disconnectDatabase();
        return newAddress
    }

    async update(addressId: string, address:Partial<Address>): Promise<object> {
        const addressData:Prisma.AddressUpdateInput = {title: address.title}
        if(address.cityId) addressData.city = {connect: { cuid: address.cityId }}
        
        const newAddress = await this.prisma.address.update({where: {cuid: addressId}, data: addressData});
        await this.disconnectDatabase();
        return newAddress
    }

    async delete(addressId: string):Promise<void> {
        await this.prisma.address.delete({ where: { cuid: addressId } })
    }

    private disconnectDatabase():void { this.prisma.$disconnect() }
}