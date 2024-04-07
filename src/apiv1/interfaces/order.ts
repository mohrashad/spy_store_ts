import { IUser } from "./IUser";
import { OrderItem } from "./orderItem";

export interface Order {
    items: OrderItem[];
    status: string;
    price: number;
    id?: string;
    cuid?: string;
    userId: number;
    addressId: string;
    user?: IUser,
    address: {
        connect?: { cuid: any }; 
        adress: string;
        city: {
            name: string;
        };
    };
}