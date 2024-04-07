import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { City } from "../../interfaces/city";

@Service()
export class CreateCityInterceptor implements InterceptorInterface {
    intercept(action: Action, city: City) {
        const newCity = { 
            id: city.cuid,
            name: city.name,
        }

        return newCity;
    }
}