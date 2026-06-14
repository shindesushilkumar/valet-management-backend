export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  flatNumber: string;
  role: string;
}

export class AuthenticatedUserDto {
  id: number;
  email: string;
  role: string;
}

export class LoginResponseDto {
  accessToken: string;
  user: AuthenticatedUserDto;
}
