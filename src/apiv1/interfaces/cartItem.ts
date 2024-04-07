import { IUser } from "./IUser";
import { Product } from "./product";

export class CartItem {
    id?:number;
    cuid?:string
    amount:number;        
    userId?:string;   
    productId?:string;
    product?:Product;
    totalPrice?: number;
    user?: { cuid: string }
}