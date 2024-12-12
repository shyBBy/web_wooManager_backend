import { Controller } from '@nestjs/common';
import { FurgonetkaService } from './furgonetka.service';

export interface FurgonetkaUser {
  username: string;
  password: string;
}


@Controller('furgonetka')
export class FurgonetkaController {
  constructor(private readonly furgonetkaService: FurgonetkaService) {}

  // @Get('/label/:id')
  // @UseGuards(JwtAuthGuard)
  // getLabel(@Param('id') id: string,) {
  //   return this.furgonetkaService.downloadShippingLabel(id)
  // }

  // @Post('token')
  // async getToken(@UserObj() user: UserEntity) {
  //   return await this.furgonetkaService.getToken(user.uuid);
  // }
}
