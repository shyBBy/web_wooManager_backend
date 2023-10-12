import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateLastChangeDto } from './dto/create-last-changes.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsAdmin } from '../guards/is-admin.guard';
import { GetPaginatedListOfAllLastChangesResponse } from '../../types/lastChange/lastChange';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/changelog/add')
  @UseGuards(JwtAuthGuard, IsAdmin)
  createChange(@Body() createLastChangeDto: CreateLastChangeDto) {
    return this.adminService.createChange(createLastChangeDto);
  }

  @Get('/changelog/list')
  @UseGuards(JwtAuthGuard)
  getAll(
    @Query('page') page: string,
    @Query('sort') sort: string,
    @Query('order') order: 'ASC' | 'DESC',
  ): Promise<GetPaginatedListOfAllLastChangesResponse> {
    return this.adminService.getAllPaginatedChanges(Number(page), sort, order);
  }
}
