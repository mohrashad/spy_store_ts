import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { Role } from "../../interfaces/role";

@Service()
export class CreateRoleInterceptor implements InterceptorInterface {
    intercept(action: Action, role: Role) {
        const newRole = { 
            id: role.cuid,
            name: role.name,
            description: role.description
        }

        return newRole;
    }
}