export interface OrderItem {
    price: number;
    amount: number;
    product: {
        name: string;
        image: string;
        price?: number;
    };
}