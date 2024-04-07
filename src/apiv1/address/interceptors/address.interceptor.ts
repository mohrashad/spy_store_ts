import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { Address } from "../../interfaces/address";

@Service()
export class AddressInterceptor implements InterceptorInterface {
    intercept(action: Action, addresses:Address[] | Address) {
        if (addresses instanceof Array) {
            return addresses.map((address) => ({
                id:address.cuid,
                title: address.title,
                city: address.city?.name || ''
            }));
        }

        if (addresses instanceof Object) {
            return {
                id:addresses.cuid,
                name: addresses.title,
                city: addresses.city?.name || ''
            };
        }
    }
}