import { Authorized, Body, Delete, Get, JsonController, NotFoundError, OnUndefined, Param, Patch, Post, UseInterceptor } from "routing-controllers";
import { Service } from "typedi";
import { City } from "../interfaces/city";
import { CityService } from "./city.service";
import { cityDto } from "./dtos/city.dto";
import { CityInterceptor } from "./interceptors/city.interceptor";
import { CreateCityInterceptor } from "./interceptors/createRole.interceptor";

@Service()
@JsonController('/cities')
export class CityController {
    constructor(private readonly cityService:CityService) {}

    @Get('/')
    @UseInterceptor(CityInterceptor)
    async findAll() {
        const cities:City[] = await this.cityService.find();
        return cities;
    }

    @Get('/:cityId')
    @UseInterceptor(CityInterceptor)
    async findById(@Param('cityId') cityId: string) {
        const city:City | null = await this.cityService.findById(cityId);
        
        if (city) return city;
        throw new NotFoundError('city does not exists')
    }

    @Post('/')
    @Authorized(['admin'])
    @UseInterceptor(CreateCityInterceptor)
    async create(@Body() createCityDto:cityDto) {
        return await this.cityService.create(createCityDto);
    }

    @Patch('/:cityId')
    @Authorized(['admin'])
    @UseInterceptor(CreateCityInterceptor)
    async update(@Param('cityId') cityId: string, @Body() updateCityDto:cityDto) {
        return await this.cityService.update(cityId, updateCityDto);
    }

    @Delete('/:cityId')
    @OnUndefined(204)
    async delete(@Param('cityId') cityId: string) {
        await this.cityService.delete(cityId)
    }
}