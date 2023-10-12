import { IsString } from 'class-validator';

export class CreateLastChangeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
