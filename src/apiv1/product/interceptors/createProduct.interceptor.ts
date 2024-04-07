import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { Product } from "../../interfaces/product";

@Service()
export class CreateProductInterceptor implements InterceptorInterface {
    intercept(action: Action, product: Product) {
        const newProduct = { 
            id: product.cuid,
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image,
        }

        return newProduct;
    }
}