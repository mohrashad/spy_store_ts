import { PrismaClient, Prisma } from "@prisma/client";
import { Service } from "typedi"
import { Product } from "../interfaces/product";
import { PaginationQueryParam } from "../interfaces/paginationQueryParam";
import { prismaClient } from "../utils/prismaClient";
import { BadRequestError, NotFoundError } from "routing-controllers";

@Service()
export class ProductService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = prismaClient;
    }

    async find(paginationInfo:PaginationQueryParam, keyword: string):Promise<Product[]> {
        let cursor = await this.prisma.product.count({ orderBy: { id: 'desc' } })
        if (paginationInfo.cursor && cursor > paginationInfo.cursor) cursor =  paginationInfo.cursor;
        
        const where:Prisma.ProductWhereInput = {};
        if (keyword)  where['OR'] = [
            {name: { contains: keyword }},
            {description: { contains: keyword }}
        ];

        const products = await this.prisma.product.findMany({
            take: paginationInfo.limit,
            cursor: { id: cursor},
            where,
            select: {
                cuid: true,
                name: true,
                category: true,
                description: true,
                image: true,
                price: true,
            },
            orderBy: { id: 'desc' }
        });

        await this.disconnectDatabase()
        return products;
    }

    async findById(productId: string): Promise<Product | null> {
        const product = await this.prisma.product.findUnique({
            where: { cuid: productId},
            select: {
                id: true,
                cuid: true,
                name: true,
                category: true,
                description: true,
                image: true,
                price: true,
            },
        });

        await this.disconnectDatabase()
        if (product) return product;
        throw new NotFoundError('this product not found')
    }

    async create(product: any): Promise<Product> {
        const newProduct = await this.prisma.product.create({ data: product });

        await this.disconnectDatabase()
        return newProduct;
    }

    async update(productId: string, product: any): Promise<Product> {
        const updatedProduct = await this.prisma.product.update({
            where: { cuid: productId },
            data: product,
        });

        await this.disconnectDatabase()
        return updatedProduct;
    }

    async delete(productId: string): Promise<void> {
        await this.prisma.product.delete({ where: { cuid: productId } });
        await this.disconnectDatabase()
    }

    private disconnectDatabase() { this.prisma.$disconnect() }
}