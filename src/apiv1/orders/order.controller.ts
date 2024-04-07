import { Authorized, BadRequestError, Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, Req, UseInterceptor } from "routing-controllers";
import { Service } from "typedi";
import { OrderService } from "./order.service";
import { CustomRequest } from "../interfaces/Request";
import { Order } from "../interfaces/order";
import { PaginationInfo } from "../utils/decorators/paginationInfo";
import { PaginationQueryParam } from "../interfaces/paginationQueryParam";
import { AddressService } from "../address/address.service";
import { Role } from "../interfaces/role";
import { OrderInterceptor } from "./interceptors/order.interceptor";
import { OrderDto } from "./dtos/order.dto";
import { CreateOrderInterceptor } from "./interceptors/createOrder.interceptor";


@Service()
@JsonController('/orders')
export class OrderController {
    constructor(private readonly orderService: OrderService, private readonly addressServcie: AddressService) { }

    @Get('/')
    @Authorized(['user', 'admin'])
    @UseInterceptor(OrderInterceptor)
    async find(@Req() req: CustomRequest, @PaginationInfo() paginationInfo: PaginationQueryParam): Promise<any> {
        let orders: Order[] = [];
        const userRoles:Role[] = req.user.roles;
        if (userRoles.findIndex(role => role.name === 'admin')) orders = await this.orderService.find(paginationInfo);
        orders = await this.orderService.find(paginationInfo, req.user.cuid);

        return orders;
    }

    @Get('/:orderId')
    @Authorized(['user', 'admin'])
    @UseInterceptor(OrderInterceptor)
    async findById(@Param('orderId') orderId: string): Promise<any> {
        const order: object|null = await this.orderService.findById(orderId);
        return order;
    }

    @Post('/')
    @Authorized(['user', 'admin'])
    @UseInterceptor(CreateOrderInterceptor)
    async create(@Req() req: CustomRequest, @Body() order: OrderDto): Promise<any> {
        const userAddressesCount = await this.addressServcie.userAddressCount(req.user.id);
        if (userAddressesCount > 0) {
            const result = await this.orderService.create({ ...order, userId: req.user.cuid });
            return result;
        }

        throw new BadRequestError('Please add new user address first .')
    }

    @Patch('/:id')
    @Authorized(['user', 'admin'])
    @UseInterceptor(CreateOrderInterceptor)
    async update(@Param('id') orderId: string, @Body() order: Partial<OrderDto>): Promise<Order> {
        return await this.orderService.update(orderId, order);
    }

    @Delete('/:id')
    @OnUndefined(204)
    @Authorized(['user', 'admin'])
    async delete(@Param('id') orderId: string): Promise<void> {
        await this.orderService.delete(orderId);
    }
}