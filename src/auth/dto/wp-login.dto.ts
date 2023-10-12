import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';

export class WpLoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class WpTokenDto {
  @IsNotEmpty()
  @IsString()
  wpToken: string;
}
