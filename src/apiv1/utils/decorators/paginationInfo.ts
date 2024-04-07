import { createParamDecorator } from "routing-controllers";
import { PaginationQueryParam } from "../../interfaces/paginationQueryParam";

export function PaginationInfo() {
    return createParamDecorator({
        value: action => {
            const limit = +action.request.query['limit'] || 15;
            const cursor = +action.request.query['cursor'] || null;

            const info:PaginationQueryParam = { limit, cursor }
            return info;
        }
    })
}