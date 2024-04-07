import { City } from "./city";

export interface Address {
    cuid?: string;
    title:string;
    city?: City;
    cityId?: string;
}