import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import type { StringValue } from 'ms';
import { QueryFailedError, Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../users/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    try {
      const passwordHash = await hash(
        dto.password,
        Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10)),
      );

      const user = this.usersRepository.create({
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        email: dto.email.toLowerCase(),
        passwordHash,
      });

      const savedUser = await this.usersRepository.save(user);

      return this.toUserResponse(savedUser);
    } catch (error) {
      if (this.isDuplicateEmailError(error)) {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await compare(dto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const signOptions: JwtSignOptions = {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_EXPIRES_IN',
        '30m',
      ) as StringValue,
    };
    const accessToken = this.jwtService.sign(
      {
        sub: String(user.id),
        email: user.email,
      },
      signOptions,
    );

    return {
      accessToken,
      user: this.toAuthenticatedUser(user),
    };
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  private toAuthenticatedUser(user: User): { id: number; email: string } {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private isDuplicateEmailError(error: unknown): boolean | undefined {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const { code, errno, sqlMessage } = error as {
      code?: string;
      errno?: number;
      sqlMessage?: string;
    };

    return code === 'ER_DUP_ENTRY' || (errno === 1062 && sqlMessage?.includes('UQ_users_email'));
  }
}
