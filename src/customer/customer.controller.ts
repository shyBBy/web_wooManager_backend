import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { GetListOfCustomersResponse } from '../../types/customer';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  getAll(@UserObj() user: UserEntity): Promise<GetListOfCustomersResponse> {
    return this.customerService.getAllCustomers(user);
  }


  @Get('/update/:id/:status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
      @Param('id') id: string,
      @Param('status') status: string,
      @UserObj() user: UserEntity
  ) {
    return this.customerService.updateStatus(id, status, user);
  }
}
