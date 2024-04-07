import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { CartItem } from "../interfaces/cartItem";
import { prismaClient } from "../utils/prismaClient";
import { ProductService } from "../product/product.service";
import { BadRequestError } from "routing-controllers";
import { UserService } from "../user/user.service";
import { IUser } from "../interfaces/IUser";
import { cartItemDtoSerializer } from "../utils/serlializers/cartItemDtoSerializer";

@Service()
export class CartItemService {
    private prisma: PrismaClient;
    constructor(private productService: ProductService, private userService: UserService) { this.prisma = prismaClient }

    async find(where: object): Promise<CartItem[]> {
        const cartItems = await this.prisma.cartItem.findMany({
            where,
            select: {
                cuid: true,
                amount: true,
                user: { select: { cuid: true } },
                product: {
                    select: {
                        cuid: true,
                        name: true,
                        category: true,
                        image: true,
                        price: true,
                    },
                }
            }
        }).then(cartItems => cartItems.map(cartItem => ({ ...cartItem, totalPrice: cartItem.amount * cartItem.product.price })));

        await this.disconnectDatabase();
        return cartItems;
    }

    async findById(cartItemId: string): Promise<CartItem | null> {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { cuid: cartItemId },
            select: {
                cuid: true,
                amount: true,
                user: { select: { cuid: true } },
                product: {
                    select: {
                        cuid: true,
                        name: true,
                        category: true,
                        image: true,
                        price: true,
                    },
                }
            }
        });

        await this.disconnectDatabase();
        return cartItem
    }

    async findByProductId(productCuid: string) {
        const product = await this.productService.findById(productCuid);

        if (product) {
            const cartItem = await this.prisma.cartItem.findUnique({
                where: { productId: product?.id },
                select: { id: true }
            });

            await this.disconnectDatabase();
            return cartItem
        }

        throw new BadRequestError('this product not found')
    }

    async create(cartItem: any): Promise<CartItem> {
        const isExistsProduct = await this.findByProductId(cartItem.productId)
        const { cuid: userId }: Partial<IUser> = await this.userService.getUserCuidById(cartItem.userId) || { cuid: '' }
        if (isExistsProduct) {
            const updatedCartItem = await this.prisma.cartItem.update({
                where: { id: isExistsProduct.id },
                data: { amount: { increment: cartItem.amount } }
            })

            return { ...updatedCartItem, productId: cartItem.productId, userId };
        }

        const newCartItem = await this.prisma.cartItem.create({ data: cartItemDtoSerializer(cartItem) });

        await this.disconnectDatabase();
        return { ...newCartItem, productId: cartItem.productId, userId };
    }

    async update(cartItemId: string, cartItem: any): Promise<CartItem> {
        const updatedCartItem = await this.prisma.cartItem.update({
            where: { cuid: cartItemId },
            data: { amount: cartItem.amount }
        });

        await this.disconnectDatabase();
        const { cuid: userId }: Partial<IUser> = await this.userService.getUserCuidById(cartItem.userId) || { cuid: '' }
        return { ...updatedCartItem, productId: cartItem.productId, userId };
    }

    async delete(cartItemId: string): Promise<void> {
        await this.prisma.cartItem.delete({ where: { cuid: cartItemId } });
        await this.disconnectDatabase();
    }

    async deleteMany(where: object): Promise<void> {
        await this.prisma.cartItem.deleteMany({ where });
        await this.disconnectDatabase();
    }

    private disconnectDatabase(): void { this.prisma.$disconnect() }
}
