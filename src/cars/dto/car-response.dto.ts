import { UserResponseDto } from '../../auth/dto/auth-response.dto';

export class CarResponseDto {
  id: number;
  make: string;
  model: string;
  registrationNumber: string;
  color: string;
  userId: number;
  user?: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
