import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { PrismaService } from './shared/services';
import { AppConfig } from './shared/config';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const CORS_OPTIONS = {
    origin: [
      'http://localhost:3000',
      'http://138.2.71.128:3000',
      'https://138.2.71.128:3000',
      'http://192.168.1.35:3000',
      'https://lecgv.up.railway.app'
    ],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization'
    ],
    exposedHeaders: 'Authorization',
    credentials: true,
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE']
  };

  const fAdapt = new FastifyAdapter();
  fAdapt.enableCors(CORS_OPTIONS);
  fAdapt.register(require('fastify-multipart'));

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fAdapt
  );

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(AppConfig.PORT, '0.0.0.0');
}

void bootstrap();
