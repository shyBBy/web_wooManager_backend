import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ActivationUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  activationCode: string;
}
