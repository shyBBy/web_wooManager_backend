import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserObj } from 'src/decorators/user-object.decorator';
import { UserEntity } from 'src/user/entities/user.entity';


@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('/refresh/orders')
  @UseGuards(JwtAuthGuard)
  getAll(@UserObj() user: UserEntity) {
    return this.statusService.getAllOrdersAndCheckStatusAndChangeIt(user.id);
  }
}
