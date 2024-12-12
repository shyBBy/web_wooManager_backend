import { StoreCreate } from '../../../types/store';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StoreCreateDto implements StoreCreate {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  consumer_key: string;

  @IsString()
  @IsNotEmpty()
  consumer_secret: string;

  @IsOptional()
  user_id: string;
}

export class StoreProfileDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  consumer_key: string;

  @IsString()
  @IsNotEmpty()
  consumer_secret: string;

  @IsString()
  user_id: string;
}