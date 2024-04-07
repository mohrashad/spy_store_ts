export interface Product {
    id?: number;
    cuid?: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}
  