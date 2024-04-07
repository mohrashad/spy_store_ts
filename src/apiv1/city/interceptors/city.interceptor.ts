import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { Role } from "../../interfaces/role";
import { City } from "../../interfaces/city";

@Service()
export class CityInterceptor implements InterceptorInterface {
    intercept(action: Action, cities:City[] | City) {
        if (cities instanceof Array) {
            return cities.map((city) => ({
                id:city.cuid,
                name: city.name,
            }));
        }

        if (cities instanceof Object) {
            return {
                id:cities.cuid,
                name: cities.name,
            };
        }
    }
}