import {Controller, Get, Param, Query, UseGuards} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/entities/user.entity';
import {GetListOfCustomersResponse, GetPaginatedListOfAllCustomersResponse} from '../../types/customer';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  getAll(
      @UserObj() user: UserEntity,
      @Query('page') page: string,
      @Query('perPage') perPage: string,
  ): Promise<GetPaginatedListOfAllCustomersResponse> {
    return this.customerService.getAllCustomers(
        user,
        Number(page),
        Number(perPage),
    );
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
