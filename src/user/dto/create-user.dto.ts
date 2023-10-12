import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { USER_ROLE, UserCreate } from '../../../types';

export class UserCreateDto implements UserCreate {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserProfileDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  jobPosition: string;

  @IsOptional()
  role: USER_ROLE;

  @IsOptional()
  isActive: boolean | number | string;

  @IsOptional()
  placeName: string;

  @IsOptional()
  permissions: string[];
}

export class UserLoginDto implements UserCreate {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
