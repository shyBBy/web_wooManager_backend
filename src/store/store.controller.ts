import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreCreateDto } from './dto/create-store.dto';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CouponCreateDto } from './dto/CreateCoupon.dto';
// import {CouponCreateDto} from "./dto/createCoupon.dto";


@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  create(@Body() createStoreDto: StoreCreateDto, @UserObj() user: UserEntity) {
    return this.storeService.create(createStoreDto, user.id);
  }
  
  // @Post('/coupon/create')
  // @UseGuards(JwtAuthGuard)
  // createCoupon(@Body() createCouponDto: CouponCreateDto, @UserObj() user: UserEntity) {
  //   console.log(createCouponDto)
  //   return this.storeService.createCoupon(createCouponDto, user.id)
  // }
  
  @Get('/coupon/list')
  @UseGuards(JwtAuthGuard)
  listAllCoupons(@UserObj() user: UserEntity) {
    return this.storeService.listAllCoupons(user.id)
  }

  @Get('coupon/:id')
  @UseGuards(JwtAuthGuard)
  getOneCouponById(@Param('id') id: string, @UserObj() user: UserEntity) {
    return this.storeService.getOneCouponById(id, user.id);
  }

  @Delete('coupon/:id')
  @UseGuards(JwtAuthGuard)
  deleteCoupon(@Param('id') id: string, @UserObj() user: UserEntity) {
    return this.storeService.deleteCoupon(id, user.id);
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
  
 

  @Get('/refresh/token')
  @UseGuards(JwtAuthGuard)
  refreshToken() {
    return this.storeService.refreshFurgonetkaToken();
  }
}
