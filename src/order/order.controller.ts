import {Controller, Get, Param, Put, Query, UseGuards} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetListOfAllOrdersResponse } from '../../types/order/order';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/entities/user.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}



  @Get('/list')
@UseGuards(JwtAuthGuard)
getAll(
  @UserObj() user: UserEntity,
  @Query('search') search?: string, // Dodano parametr search
): Promise<GetListOfAllOrdersResponse> {
  return this.orderService.getAllOrders(user.id, search);
}

  @Get('/reports/sales')
  @UseGuards(JwtAuthGuard)
  getSalesReport(
      @UserObj() user: UserEntity,
      @Query('fromDate') fromDate: string,
  ) {
    return this.orderService.getSalesReport(user.id, fromDate);
  }

  @Get('/reports/orders')
  @UseGuards(JwtAuthGuard)
  getOrdersReport(@UserObj() user: UserEntity) {
    return this.orderService.getOrdersReport(user.id);
  }

  @Get('/reports/topproducts')
  @UseGuards(JwtAuthGuard)
  getTopProductSales(@UserObj() user: UserEntity) {
    return this.orderService.getTopProductSales(user.id);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getOneById(@Param('id') id: string, @UserObj() user: UserEntity) {
    console.log("DUPADADA@#@#@#@#@#@")
    return this.orderService.getOneById(id, user.id);
  }




  // @Put('/status/:id')
  // @UseGuards(JwtAuthGuard)
  // updateStatus(
  //     @Param('id') id: string,
  //     @UserObj() user: UserEntity
  // ){
  //     return this.orderService.updateStatus(id, user.uuid)
  // }
}
