import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/error.filter';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });
  const configService = app.get(ConfigService);

  app.use(helmet());

  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/']
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Starts listening for shutdown hooks
  if (configService.get('app.envName') !== 'development') {
    app.enableShutdownHooks();
  }

  // setup api documentation
  setupSwagger(app);

  await app.listen(configService.get('app.port'));

  console.log(
    `Application server listening on port ${configService.get('app.port')}`
  );
}
bootstrap();
