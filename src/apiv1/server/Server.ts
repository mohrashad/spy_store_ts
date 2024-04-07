import dotenv from 'dotenv';
import express from 'express';
import Container from 'typedi';
import { CityController } from '../city/city.controller';
import { RoleController } from '../roles/role.controller';
import { AuthController } from '../auth/auth.controller';
import { UserController } from '../user/user.controller';
import { authCheck } from '../utils/Authorization_checker';
import { OrderController } from '../orders/order.controller';
import { ErrorMiddleware } from '../middleware/error.middleware';
import { ProductController } from '../product/proudct.controller';
import { AddressController } from '../address/address.controller';
import { HelmetMiddleware } from '../middleware/helmet.middleware';
import { CartItemController } from '../cartItem/cartItem.controller';
import { createExpressServer, useContainer } from 'routing-controllers';
import { LoggingMiddleware } from '../middleware/httpLogging.middleware';
import { RateLimitMiddleware } from '../middleware/rateLimit.middleware';

dotenv.config();
export class Server {
  private app: express.Application;
  private port: number;

  public constructor() {
    useContainer(Container)
    this.app = createExpressServer({
      cors: true,
      authorizationChecker: authCheck,
      defaultErrorHandler: false,
      middlewares: [RateLimitMiddleware, HelmetMiddleware, ErrorMiddleware, LoggingMiddleware],
      controllers: [AuthController, ProductController, CartItemController, OrderController, UserController, AddressController, CityController, RoleController],
    });

    this.port = Number(process.env.PORT) || 3000;
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
