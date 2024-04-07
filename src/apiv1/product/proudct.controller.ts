import { Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, QueryParam, UploadedFile, UseInterceptor } from "routing-controllers";
import { Service } from "typedi";
import { ProductService } from "./product.service";
import { ProductDto } from "./dtos/product.dto";
import { Product } from "../interfaces/product";
import { fileUploadOptions } from "../utils/uploadFilesHandler";
import { PaginationInfo } from "../utils/decorators/paginationInfo";
import { PaginationQueryParam } from "../interfaces/paginationQueryParam";
import { CreateProductInterceptor } from "./interceptors/createProduct.interceptor";
import { ProductInterceptor } from "./interceptors/product.interceptor";

@Service()
@JsonController('/products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Authorized(['admin', 'user'])
    @Get('/')
    @UseInterceptor(ProductInterceptor)
    getAllProducts(@QueryParam('keyword') keyword:string,  @PaginationInfo() paginationInfo:PaginationQueryParam): Promise<any> {
        return this.productService.find(paginationInfo, keyword);
    }

    @Authorized(['admin', 'user'])
    @Get('/:productId')
    @UseInterceptor(ProductInterceptor)
    getProductById(@Param('productId') productId: string): Promise<any> {
        return this.productService.findById(productId);
    }

    @Post('/')
    @Authorized(['admin'])
    @UseInterceptor(CreateProductInterceptor)
    createProduct(@UploadedFile('image', {options: fileUploadOptions()}) image:Express.Multer.File, @Body() createProductDto:ProductDto): Promise<any> {
        const newProduct:Product = {
            ...createProductDto,
            image: image.filename,
            price: +createProductDto?.price
        };

        return this.productService.create(newProduct);
    }

    @Patch('/:productId')
    @Authorized(['admin'])
    @UseInterceptor(CreateProductInterceptor)
    updateProduct(
        @Param('productId') productId: string,
        @Body() updateProductDto: Partial<ProductDto>,
        @UploadedFile('image', {options: fileUploadOptions()}) image?:Express.Multer.File
    ): Promise<any> {
        const newBroduct:Partial<Product> = {...updateProductDto}
        
        if (image) newBroduct.image = image.filename;
        if (updateProductDto.price) newBroduct.price = +updateProductDto.price

        return this.productService.update(productId, newBroduct);
    }

    @Authorized(['admin'])
    @Delete('/:productId')
    @OnUndefined(204)
    deleteProduct(@Param('productId') productId: string):void {
        this.productService.delete(productId);
    }
}