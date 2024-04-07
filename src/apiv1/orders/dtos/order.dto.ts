import { IsArray, IsIn, IsNotEmpty, IsString } from "class-validator";
import { IsValidCuid } from "../../utils/decorators/isValidCuid";
import { IsExistsAddress } from "../../utils/decorators/isExistsAddress";

enum OrdersStatus {
    pending =  "pending",
    rejected = "rejected",
    canceled = "canceled",
    filled = "filled"
}

export class OrderDto {
    @IsString()
    @IsNotEmpty()
    @IsValidCuid({ message: 'Invalid id format' })
    @IsExistsAddress({ message: 'invalid address or not found' })
    addressId: string

    // @IsArray()
    // @IsNotEmpty()
    // items: OrderItemDto[]

    @IsNotEmpty()
    @IsIn([OrdersStatus.pending, OrdersStatus.rejected, OrdersStatus.canceled, OrdersStatus.filled])
    status: OrdersStatus
}