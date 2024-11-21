import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './shared/config/index.config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import {
  GlobalErrorInterceptor,
  ResultInterceptor,
} from './shared/interceptor/result.interceptor';
import { JwtGuard } from './shared/guard/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import '../instrument';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('FXQL  API')
    .setDescription('The http Integration API description')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh-token',
    )
    .addSecurityRequirements('access-token')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`api`, app, document);

  Sentry.init({
    dsn: appConfig().sentryDsn,
    integrations: [],
    tracesSampleRate: appConfig().tracesSampleRate,
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new GlobalErrorInterceptor());
  app.useGlobalInterceptors(new ResultInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalGuards(new JwtGuard(new Reflector()));

  await app.listen(appConfig().port);

  Logger.log(
    `🚀🚀🚀 - - - Application is running on: ${await app.getUrl()} - - - 🚀🚀🚀`,
  );
}
bootstrap();
