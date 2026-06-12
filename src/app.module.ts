import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CreateUsersTable1775916000000 } from './database/migrations/1775916000000-CreateUsersTable';
import { AddFlatNumberToUsersTable1775916100000 } from './database/migrations/1775916100000-AddFlatNumberToUsersTable';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule,
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
          entities: [User],
          migrations: [
            CreateUsersTable1775916000000,
            AddFlatNumberToUsersTable1775916100000,
          ],
          synchronize: false,
          migrationsRun: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
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
