import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCarDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  carNumber?: string;
}
