import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { CreateUsersTable1775916000000 } from './database/migrations/1775916000000-CreateUsersTable';
import { AddFlatNumberToUsersTable1775916100000 } from './database/migrations/1775916100000-AddFlatNumberToUsersTable';
import { CreateCarsTable1775917000000 } from './database/migrations/1775917000000-CreateCarsTable';
import { User } from './users/user.entity';
import { Car } from './cars/entities/car.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mysqlPort = Number(
          configService.getOrThrow<string>('MYSQL_PORT'),
        );

        return {
          type: 'mysql',
          host: configService.getOrThrow<string>('MYSQL_HOST'),
          port: mysqlPort,
          username: configService.getOrThrow<string>('MYSQL_USER'),
          password: configService.getOrThrow<string>('MYSQL_PASSWORD'),
          database: configService.getOrThrow<string>('MYSQL_DATABASE'),
          entities: [User, Car],
          migrations: [
            CreateUsersTable1775916000000,
            AddFlatNumberToUsersTable1775916100000,
            CreateCarsTable1775917000000,
          ],
          synchronize: false,
          migrationsRun: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
