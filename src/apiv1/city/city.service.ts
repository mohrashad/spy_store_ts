import { Service } from "typedi";
import { prismaClient } from "../utils/prismaClient";
import { City } from "../interfaces/city";

@Service()
export class CityService {
    private readonly prisma
    constructor() { this.prisma = prismaClient }

    async find():Promise<City[]> {
        const cities: City[] = await this.prisma.city.findMany({
            select: {
                cuid: true,
                name: true,
            }
        })

        await this.disconnectDatabase()
        return cities;
    }

    async findById(id: string) : Promise<City | null> {
        const city = await this.prisma.city.findUnique({
            where: { cuid: id },
            select: {
                cuid: true,
                name: true,
            },
        })

        await this.disconnectDatabase()
        return city
    }

    async findByName(name:string) : Promise<City | null> {
        const city = await this.prisma.city.findUnique({
            where: { name },
            select: {
                id: true,
                name: true,
            },
        })

        await this.disconnectDatabase()
        return city
    }

    async create(city: City) : Promise<City> {
        const newCity = await this.prisma.city.create({ data: city });

        await this.disconnectDatabase()
        return newCity;
    }

    async update(id:string, city:City) : Promise<City> {
        const newCity = await this.prisma.city.update({ data: city, where: { cuid: id } });

        await this.disconnectDatabase()
        return newCity;
    }

    async delete(id:string):Promise<void> {
        await this.prisma.city.delete({ where: { cuid: id } })
        await this.disconnectDatabase()
    }

    private disconnectDatabase() {
        this.prisma.$disconnect();
    }
}