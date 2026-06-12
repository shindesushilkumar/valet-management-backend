import { UserResponseDto } from '../../auth/dto/auth-response.dto';

export class CarResponseDto {
  id: number;
  carNumber: string;
  userId: number;
  user?: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
