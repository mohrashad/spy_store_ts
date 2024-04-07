import { Action, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";
import { Role } from "../../interfaces/role";

@Service()
export class RoleInterceptor implements InterceptorInterface {
    intercept(action: Action, roles: Role[]) {
        const newRoles = roles.map((role) => ({
            id:role.cuid,
            name: role.name,
            description: role.description
        }));

        return newRoles;
    }
}