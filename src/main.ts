import cors, { CorsOptions } from 'cors';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_CORS_ALLOWED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173'];

function parseAllowedOrigins(configService: ConfigService): string[] {
  const configuredOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS');

  if (!configuredOrigins) {
    return DEFAULT_CORS_ALLOWED_ORIGINS;
  }

  return [
    ...new Set(
      configuredOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  ];
}

function parseBooleanConfig(
  configService: ConfigService,
  key: string,
): boolean {
  const value = configService.get<string | boolean>(key);

  return value === true || value === 'true';
}

function buildCorsOptions(configService: ConfigService): CorsOptions {
  return {
    origin: parseAllowedOrigins(configService),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: parseBooleanConfig(configService, 'CORS_ALLOW_CREDENTIALS'),
  };
}

async function bootstrap() {
  await ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    load: [() => ({})],
  });
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cors(buildCorsOptions(configService)));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
