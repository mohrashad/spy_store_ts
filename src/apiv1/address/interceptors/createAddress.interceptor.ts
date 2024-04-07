import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { Address } from "../../interfaces/address";

@Service()
export class CreateAddressInterceptor implements InterceptorInterface {
    intercept(action: Action, address: Address) {
        const newAddress = { 
            id: address.cuid,
            name: address.title,
        }

        return newAddress;
    }
}