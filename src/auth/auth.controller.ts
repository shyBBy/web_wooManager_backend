import {Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserEntity } from '../user/entities/user.entity';
import { UserObj } from 'src/decorators/user-object.decorator';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserObj() user: UserEntity, @Res() res: Response) {
    return this.authService.login(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
