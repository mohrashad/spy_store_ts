import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { CartItem } from "../../interfaces/cartItem";

@Service()
export class CreateCartItemInterceptor implements InterceptorInterface {
    intercept(action: Action, cartItem: CartItem) {
        const newCartItem = { 
            id: cartItem.cuid,
            amount: cartItem.amount,
            userId: cartItem.userId,
            productId: cartItem.productId
        }

        return newCartItem;
    }
}