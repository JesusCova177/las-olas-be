import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';

/** Security Packages */
import helmet from 'helmet';
import * as xss from 'xss-clean';
import * as hpp from 'hpp';
import * as requestIp from 'request-ip';

import { parseEnviroment } from './common/enums';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    forceCloseConnections: true,
    abortOnError: true,
    // Set`bufferLogs` to 'true' when ready for production.
    bufferLogs: true,
  });

  // Dependency Injection
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  // Config Values
  const enviroment = parseEnviroment(
    configService.getOrThrow<string>('enviroment').toLowerCase(),
  );
  // const isProduction = enviroment === Enviroment.PRODUCTION;
  // const isDevelopment = enviroment === Enviroment.DEVELOPMENT;
  // const allowedCorsOrigins = configService.getOrThrow<[string]>('ALLOWED_ORIGINS');
  const appPort = configService.getOrThrow<number>('port');

  // App Settings
  app.set('trust proxy', 0);
  app.disable('x-powered-by');
  app.setGlobalPrefix('api');

  // Logging Setup
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Setup Template Engine
  // app.useStaticAssets(join(__dirname, '..', 'public'), {
  //   prefix: '/public',
  // });

  app.enableCors({ origin: true });
  // CORS HANDLING
  // app.enableCors({
  //   origin: (reqOrigin, cb) => {
  //     if (!isProduction || !reqOrigin || allowedCorsOrigins.indexOf(reqOrigin) !== -1) {
  //       cb(null, true);
  //     } else {
  //       cb(new Error('Not allowed by CORS.'), false);
  //     }
  //   },
  //   allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  //   methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  //   credentials: true,
  // });

  // Using Middlewares
  app.use(helmet());
  app.use(xss());
  app.use(hpp());
  app.use(requestIp.mw());

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false,
    }),
  );

  // Listen
  await app.listen(appPort);
  const url = await app.getUrl();
  logger.log('=================== APP RUNNING ===================');
  logger.log('');
  logger.log(`  -> App Enviroment: '${enviroment}'`);
  logger.log(`  -> App URL: ${url}`);
  logger.log('');
  logger.log('===================================================');
}

bootstrap();
