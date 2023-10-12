import {Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserEntity } from '../user/entities/user.entity';
import { UserObj } from 'src/decorators/user-object.decorator';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {WpLoginDto, WpTokenDto} from './dto/wp-login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserObj() user: UserEntity, @Res() res: Response) {
    return this.authService.login(user, res);
  }

  @Post('wp-login')
  @UseGuards(JwtAuthGuard)
  async wpLogin(
    @UserObj() user: UserEntity,
    @Body() wpLoginDto: WpLoginDto,
    @Res() res: Response,
  ) {
    return this.authService.wpLogin(wpLoginDto, user, res);
  }

  @Get('wp-login/token')
  @UseGuards(JwtAuthGuard)
  async checkWpToken(
      @UserObj() user: UserEntity
  ) {
    return this.authService.checkWpToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
