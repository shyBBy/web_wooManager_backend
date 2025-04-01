import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';


@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.statusService.getAllOrdersAndCheckStatusAndChangeIt();
  }
}
