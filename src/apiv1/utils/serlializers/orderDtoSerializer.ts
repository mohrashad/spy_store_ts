
export function orderDtoSerializer(order: any):any {
    const newOrder:object =  {
        status: order.status,
        address: { connect: { cuid: order.addressId } },
        user: { connect: { cuid: order.userId } },
        items: order.items,
    }

    return newOrder;
}