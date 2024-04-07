import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { Order } from "../../interfaces/order";
@Service()
export class CreateOrderInterceptor implements InterceptorInterface {
    intercept(action: Action, order: Order) {
        let newOrder:any = { id: order.cuid, status: order.status }
        if (action.request.method === 'POST') {
            newOrder.userId =  order.userId;
            newOrder.addressId = order.addressId;
        }

        return newOrder;
    }
}