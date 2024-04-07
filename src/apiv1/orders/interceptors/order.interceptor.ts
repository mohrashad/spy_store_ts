import { Service } from "typedi";
import { Action, InterceptorInterface, NotFoundError } from "routing-controllers";
import { serializeOrder } from "../../utils/serlializers/orderSerializer";

@Service()
export class OrderInterceptor implements InterceptorInterface {
    intercept(action: Action, orders: any) {
        if (orders instanceof Array) {
            const newOrders = orders.map((order) => serializeOrder(order));
            return newOrders;
        }
        
        if (orders instanceof Object) return serializeOrder(orders)
        throw new NotFoundError('order does not exists')
    }
}