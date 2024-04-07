import { Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, Req, UseInterceptor } from "routing-controllers";
import { Service } from "typedi";
import { CartItemService } from "./cartItem.service";
import { CartItem } from "../interfaces/cartItem";
import { CartItemDto } from "./dtos/cart-item.dto";
import { CreateCartItemInterceptor } from "./interceptors/createCartItemt.interceptor";
import { CartItemInterceptor } from "./interceptors/cartItem.interceptor";
import { CustomRequest } from "../interfaces/Request";

@Service()
@JsonController('/cart_items')
export class CartItemController {
    constructor(private readonly cartItemService: CartItemService) {}

    @Get('/')
    @Authorized(['user', 'admin'])
    @UseInterceptor(CartItemInterceptor)
    getAllItems(): Promise<CartItem[]> {
        return this.cartItemService.find({});
    }

    @Get('/:cartItemId')
    @Authorized(['user', 'admin'])
    @UseInterceptor(CartItemInterceptor)
    getItemById(@Param('cartItemId') cartItemId: string): Promise<CartItem | null> {
        return this.cartItemService.findById(cartItemId);
    }

    @Post('/')
    @Authorized(['user', 'admin'])
    @UseInterceptor(CreateCartItemInterceptor)
    create(@Req() req: any, @Body() cartItem: CartItemDto): Promise<any> {
        const newCartItem:CartItem = {...cartItem, userId: req.user.id}
        return this.cartItemService.create(newCartItem);
    }

    @Patch('/:cartItemId')
    @UseInterceptor(CreateCartItemInterceptor)
    @Authorized(['user', 'admin'])
    async update(@Req() req:CustomRequest, @Param('cartItemId') cartItemId: string, @Body() cartItem: Partial<CartItemDto>): Promise<CartItem> {
        return this.cartItemService.update(cartItemId, {...cartItem, userId: req.user.id});
    }

    @OnUndefined(204)
    @Delete('/:cartItemId')
    @Authorized(['user', 'admin'])
    delete(@Param('cartItemId') cartItemId: string):void {
        this.cartItemService.delete(cartItemId);
    }
}