
export function cartItemDtoSerializer(cartItem: any):any {
    const newCartItem:object =  {
        product: { connect: { cuid: cartItem.productId } },
        amount : cartItem.amount,
        user : { connect: { id: cartItem.userId } },
    }

    return newCartItem;
}