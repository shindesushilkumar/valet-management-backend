import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { CreateUsersTable1775916000000 } from './migrations/1775916000000-CreateUsersTable';
import { AddFlatNumberToUsersTable1775916100000 } from './migrations/1775916100000-AddFlatNumberToUsersTable';

void ConfigModule.forRoot({
  envFilePath: '.env',
});

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.getOrThrow<string>('MYSQL_HOST'),
  port: Number(configService.getOrThrow<string>('MYSQL_PORT')),
  username: configService.getOrThrow<string>('MYSQL_USER'),
  password: configService.getOrThrow<string>('MYSQL_PASSWORD'),
  database: configService.getOrThrow<string>('MYSQL_DATABASE'),
  entities: [],
  migrations: [
    CreateUsersTable1775916000000,
    AddFlatNumberToUsersTable1775916100000,
  ],
});
