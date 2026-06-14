import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { AuthModule } from '../src/auth/auth.module';
import { LoginResponseDto } from '../src/auth/dto/auth-response.dto';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';
import { RegisterUserDto } from '../src/auth/dto/register-user.dto';
import { UserResponseDto } from '../src/auth/dto/auth-response.dto';

interface AuthenticatedUser {
  id: number;
  email: string;
}

type AuthServiceMock = {
  register: jest.Mock<Promise<UserResponseDto>, [RegisterUserDto]>;
  login: jest.Mock<Promise<LoginResponseDto>, [LoginUserDto]>;
};

class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers?: { authorization?: string };
      user?: AuthenticatedUser;
    }>();
    const authorization = request.headers?.authorization;

    if (authorization !== 'Bearer valid-token') {
      throw new UnauthorizedException();
    }

    request.user = {
      id: 1,
      email: 'customer@example.com',
    };
    return true;
  }
}

describe('AuthController (e2e)', () => {
  let app: INestApplication<App> | undefined;
  let authService: AuthServiceMock;

  const getHttpServer = (): App => {
    if (!app) {
      throw new Error('App has not been initialized');
    }
    return app.getHttpServer();
  };

  beforeEach(async () => {
    process.env.BCRYPT_SALT_ROUNDS = '10';
    process.env.JWT_EXPIRES_IN = '30m';
    process.env.JWT_SECRET = 'test-secret';

    await ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    });

    authService = {
      register: jest.fn<Promise<UserResponseDto>, [RegisterUserDto]>(),
      login: jest.fn<Promise<LoginResponseDto>, [LoginUserDto]>(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('POST /auth/register creates a user', () => {
    authService.register.mockResolvedValue({
      id: 1,
      email: 'customer@example.com',
      firstName: 'Customer',
      lastName: 'User',
      flatNumber: 'A-101',
      role: 'owner',
    });

    return request(getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Customer',
        lastName: 'User',
        flatNumber: 'A-101',
        email: 'Customer@example.com',
        password: 'SecretPass1!',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body).toEqual({
          id: 1,
          email: 'customer@example.com',
          firstName: 'Customer',
          lastName: 'User',
          flatNumber: 'A-101',
          role: 'owner',
        });
        expect(authService.register).toHaveBeenCalledWith({
          firstName: 'Customer',
          lastName: 'User',
          flatNumber: 'A-101',
          email: 'Customer@example.com',
          password: 'SecretPass1!',
        });
      });
  });

  it('POST /auth/register returns 409 for duplicate email', () => {
    authService.register.mockRejectedValue(
      new ConflictException('Email already registered'),
    );

    return request(getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Customer',
        lastName: 'User',
        flatNumber: 'A-101',
        email: 'customer@example.com',
        password: 'SecretPass1!',
      })
      .expect(409);
  });

  it('POST /auth/register returns 400 for missing flat number', () => {
    return request(getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Customer',
        lastName: 'User',
        email: 'customer@example.com',
        password: 'SecretPass1!',
      })
      .expect(400);
  });

  it('POST /auth/register returns 400 for empty flat number', () => {
    return request(getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Customer',
        lastName: 'User',
        flatNumber: '   ',
        email: 'customer@example.com',
        password: 'SecretPass1!',
      })
      .expect(400);
  });

  it('POST /auth/register returns 400 for invalid payload', () => {
    return request(getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Customer',
        lastName: 'User',
        flatNumber: 'A-101',
        email: 'not-an-email',
        password: 'weak',
      })
      .expect(400);
  });

  it('POST /auth/login returns an access token', () => {
    authService.login.mockResolvedValue({
      accessToken: 'access-token',
      user: {
        id: 1,
        email: 'customer@example.com',
        role: 'owner',
      },
    });

    return request(getHttpServer())
      .post('/auth/login')
      .send({
        email: 'Customer@example.com',
        password: 'SecretPass1!',
      })
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          accessToken: 'access-token',
          user: {
            id: 1,
            email: 'customer@example.com',
            role: 'owner',
          },
        });
        expect(authService.login).toHaveBeenCalledWith({
          email: 'Customer@example.com',
          password: 'SecretPass1!',
        });
      });
  });

  it('POST /auth/login returns 401 for invalid credentials', () => {
    authService.login.mockRejectedValue(
      new UnauthorizedException('Invalid credentials'),
    );

    return request(getHttpServer())
      .post('/auth/login')
      .send({
        email: 'customer@example.com',
        password: 'WrongPass1!',
      })
      .expect(401);
  });

  it('GET /auth/me returns the authenticated user', () => {
    return request(getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect({
        id: 1,
        email: 'customer@example.com',
      });
  });

  it('GET /auth/me returns 401 without a bearer token', () => {
    return request(getHttpServer()).get('/auth/me').expect(401);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
