import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { QueryFailedError, DeepPartial } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

type UserRepositoryMock = {
  findOne: jest.Mock<Promise<User | null>, [Record<string, unknown>]>;
  create: jest.Mock<User, [DeepPartial<User>]>;
  save: jest.Mock<Promise<User>, [User]>;
};

const createRepositoryMock = (): UserRepositoryMock => ({
  findOne: jest.fn<Promise<User | null>, [Record<string, unknown>]>(),
  create: jest.fn<User, [DeepPartial<User>]>(),
  save: jest.fn<Promise<User>, [User]>(),
});

const createConfigServiceMock = (): ConfigService =>
  ({
    get: jest.fn((key: string, defaultValue: string | number) => {
      if (key === 'BCRYPT_SALT_ROUNDS') return 10;
      if (key === 'JWT_EXPIRES_IN') return '30m';
      return defaultValue;
    }),
    getOrThrow: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      throw new Error(`Missing ${key}`);
    }),
  }) as unknown as ConfigService;

describe('AuthService', () => {
  let service: AuthService;
  let repository: UserRepositoryMock;
  let jwtService: JwtService;

  beforeEach(async () => {
    repository = createRepositoryMock();
    jwtService = new JwtService({ secret: 'test-secret' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: repository },
        { provide: ConfigService, useValue: createConfigServiceMock() },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('hashes the password before saving a user', async () => {
    repository.create.mockImplementation(
      (user) =>
        ({
          ...user,
          id: 1,
          passwordHash: user.passwordHash as string,
        }) as User,
    );
    repository.save.mockImplementation((user) => Promise.resolve(user));

    const result = await service.register({
      firstName: 'Customer',
      lastName: 'User',
      email: 'customer@example.com',
      password: 'SecretPass1!',
    });

    expect(result).toEqual({
      id: 1,
      email: 'customer@example.com',
      firstName: 'Customer',
      lastName: 'User',
    });
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'customer@example.com',
        firstName: 'Customer',
        lastName: 'User',
      }),
    );

    const savedUser = repository.save.mock.calls[0][0];
    expect(savedUser.passwordHash).not.toBe('SecretPass1!');
    await expect(compare('SecretPass1!', savedUser.passwordHash)).resolves.toBe(
      true,
    );
  });

  it('rejects duplicate email registration', async () => {
    const driverError = new Error(
      "Duplicate entry 'customer@example.com' for key 'UQ_users_email'",
    ) as Error & { code: string; errno: number; sqlMessage: string };
    driverError.code = 'ER_DUP_ENTRY';
    driverError.errno = 1062;
    driverError.sqlMessage =
      "Duplicate entry 'customer@example.com' for key 'UQ_users_email'";
    repository.save.mockRejectedValue(
      new QueryFailedError('INSERT INTO users', [], driverError),
    );

    await expect(
      service.register({
        firstName: 'Customer',
        lastName: 'User',
        email: 'customer@example.com',
        password: 'SecretPass1!',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects invalid login credentials when the user does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'customer@example.com',
        password: 'SecretPass1!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects invalid login credentials when the password does not match', async () => {
    repository.findOne.mockResolvedValue({
      id: 1,
      email: 'customer@example.com',
      passwordHash: 'hashed-password',
    } as User);

    await expect(
      service.login({
        email: 'customer@example.com',
        password: 'WrongPass1!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
