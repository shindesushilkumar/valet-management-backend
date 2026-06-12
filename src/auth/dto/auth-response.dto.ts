export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export class AuthenticatedUserDto {
  id: number;
  email: string;
}

export class LoginResponseDto {
  accessToken: string;
  user: AuthenticatedUserDto;
}
