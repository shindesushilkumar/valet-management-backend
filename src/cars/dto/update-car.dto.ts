import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCarDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  make?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  model?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color?: string;
}
