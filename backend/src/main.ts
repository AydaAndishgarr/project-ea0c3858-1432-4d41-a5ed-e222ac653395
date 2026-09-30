import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const prefix = config.get<string>('apiPrefix') ?? 'api/v1';
  const origin = config.get<string>('frontendOrigin') ?? 'http://localhost:8080';
  const port = config.get<number>('port') ?? 3001;

  const origins = origin
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  app.setGlobalPrefix(prefix);
  app.use(cookieParser());
  app.enableCors({
    origin: origins.length <= 1 ? origins[0] : origins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/${prefix}`);
}

bootstrap();
