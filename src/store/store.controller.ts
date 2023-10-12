import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { StoreCreateDto } from './dto/create-store.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserObj } from '../decorators/user-object.decorator';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  create(@Body() createStoreDto: StoreCreateDto, @UserObj() user: UserEntity) {
    return this.storeService.create(createStoreDto, user.id);
  }

  @Get('/byuserid')
  @UseGuards(JwtAuthGuard)
  getOneByUserId(@UserObj() user: UserEntity) {
    return this.storeService.getStoreByUserId(user.id);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getOneById(@Param('id') id: string) {
    return this.storeService.getOneById(id);
  }

  @Get('/reports/sales')
  @UseGuards(JwtAuthGuard)
  getSalesReport(
      @UserObj() user: UserEntity,
      // @Query('fromDate') fromDate: string,
  ) {
    return this.storeService.getSalesReport(user.id);
  }
}
