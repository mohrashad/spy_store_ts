import { Product } from "@prisma/client";
import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";

@Service()
export class ProductInterceptor implements InterceptorInterface {
    intercept(action: Action, products: Product | Product[]) {
        if (products instanceof Array) {
            const newProducts = products.map((product) => ({
                id: product.cuid,
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                image: product.image,
            }));

            return newProducts;
        }

        if (products instanceof Object) {
            const newProduct = {
                id: products.cuid,
                name: products.name,
                price: products.price,
                category: products.category,
                description: products.description,
                image: products.image,
            }
            return newProduct;
        }

    }
}