import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { CartItem } from "../../interfaces/cartItem";

@Service()
export class CartItemInterceptor implements InterceptorInterface {
    intercept(action: Action, cartItems: CartItem | CartItem[]) {
        if (cartItems instanceof Array) {
            const newCartItems = cartItems.map((cartItem) => ({
                id: cartItem.cuid,
                amount: cartItem.amount,
                userId: cartItem.user?.cuid,
                product: {
                    id: cartItem.product?.cuid,
                    name: cartItem.product?.name,
                    price: cartItem.product?.price,
                    category: cartItem.product?.category,
                    description: cartItem.product?.description,
                    image: cartItem.product?.image,
                } || {},
                totalPrice: cartItem.totalPrice
            }));

            return newCartItems;
        }

        if (cartItems instanceof Object) {
            const newCartItem = {
                id: cartItems.cuid,
                amount: cartItems.amount,
                userId: cartItems.user?.cuid,
                product: {
                    id: cartItems.product?.cuid,
                    name: cartItems.product?.name,
                    price: cartItems.product?.price,
                    category: cartItems.product?.category,
                    description: cartItems.product?.description,
                    image: cartItems.product?.image,
                } || {},
                totalPrice: cartItems.totalPrice
            }

            return newCartItem;
        }

    }
}