import { Prisma, PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { CartItemService } from "../cartItem/cartItem.service";
import { PaginationQueryParam } from "../interfaces/paginationQueryParam";
import { prismaClient } from "../utils/prismaClient";
import { orderDtoSerializer } from "../utils/serlializers/orderDtoSerializer";

@Service()
export class OrderService {
    private prisma: PrismaClient;
    constructor(private cartItemService: CartItemService) { this.prisma = prismaClient }

    async find(paginationInfo:PaginationQueryParam, userId?: string): Promise<any[]> {
        let { id:cursor } = await this.prisma.order.findFirst({select: { id:true }, orderBy: { id: 'desc' } }) || {}
        if (paginationInfo.cursor && cursor && cursor > paginationInfo.cursor) cursor =  paginationInfo.cursor;

        const where:Prisma.OrderWhereInput = {};
        if (userId)  where['user'] = { cuid: userId }
    
        const orders = await this.prisma.order.findMany({
            where,
            cursor: { id: cursor },
            take: paginationInfo.limit,
            select: {
                cuid: true,
                user: { select: { cuid: true } },
                address: { select: { title: true, city: { select: { name: true } } } },
                items: { select: {amount: true, product: { select: { name: true, image: true, price: true } }} },
                status: true
            },
            orderBy: { id: 'desc' }
        });

        await this.disconnectDatabase()
        return orders;
    }

    async findById(orderId: string): Promise<object | null> {
        const order = await this.prisma.order.findUnique({
            select: {
                cuid: true,
                user: { select: { cuid: true } },
                address: { select: { title: true, city: { select: { name: true } } } },
                items: { select: {amount: true, product: { select: { name: true, image: true, price: true } }} },
                status: true
            },
            where: { cuid: orderId }
        });

        await this.disconnectDatabase()  
        return order
    }

    async create(order: any): Promise<any> {
        const orderItems = (
            await this.cartItemService.find({ user: { cuid: order.userId } }))
            .map(item => ({product: { connect: { cuid: item.product?.cuid } }, amount: item.amount})
        )

        const orderDto:Prisma.OrderCreateInput = orderDtoSerializer({...order, items: {create: orderItems}});
        const newOrder = await this.prisma.order.create({ data: orderDto});

        // await this.cartItemService.deleteMany({ userId: order.userId })
        await this.cartItemService.deleteMany({ user: { cuid: order.userId } })

        await this.disconnectDatabase()
        return { ...newOrder, ...order }
    }

    async update(orderId: string, order: any): Promise<any> {
        const newOrder = { ...order };
        delete newOrder.items;
        const updatedOrder = await this.prisma.order.update({
            where: { cuid: orderId },
            data: {...newOrder}
        });

        if (order?.items) {
            order.items.forEach(async (item: any) => {
                await this.prisma.orderItem.updateMany({
                    where: { order: { cuid: orderId }, product: { cuid: item.productId } },
                    data: { amount: item.amount },
                });
            })
        }

        await this.disconnectDatabase()
        return {...updatedOrder, ...order}
    }

    async delete(orderId: string): Promise<void> {
        await this.prisma.order.update({
            where: { cuid: orderId },
            data: {
                items: {deleteMany: {}},
            },
        })

        await this.prisma.order.delete({ where: { cuid: orderId }})
        await this.disconnectDatabase()
    }

    private disconnectDatabase():void { this.prisma.$disconnect()}
}