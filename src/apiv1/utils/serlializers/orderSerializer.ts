import { Order } from "../../interfaces/order";
import { OrderItem } from "../../interfaces/orderItem";

export function serializeOrder(order: any):Order|null {
    if (order) {
        const orderItems = order.items.map((item:any)=> {
            const newItem:OrderItem = { ...item, price: item.amount * item.product.price }
            if (newItem.product && newItem.product.price) delete newItem.product.price
            return newItem
        })

        const newOrder:Order =  {
            id: order.cuid,
            userId: order.user.cuid,
            price : orderItems.reduce((total:number, item:OrderItem) => total + item.amount * item.price, 0),
            ...order,
            address: { title: order.address.title, city: order.address.city.name },
            items: orderItems,
            status: order.status
        }
    
        delete newOrder.cuid;
        delete newOrder.user;
        return newOrder;
    }

    return null
}