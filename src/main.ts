import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { PrismaService } from './shared/services';
import { AppConfig } from './shared/config';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const fAdapt = new FastifyAdapter()
  fAdapt.register(require('fastify-multipart'))

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
