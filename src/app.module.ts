import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppConfiguration } from './config/app.config';
import { JoiSchemaValidation } from './config/joi.validation';
import { ThrottlerConfigService } from './config/throttler.config';

import { Enviroment } from './common/enums';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';

import { MailModule } from './mail/mail.module';
console.log(JoiSchemaValidation);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfiguration],
      validationSchema: JoiSchemaValidation,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProdEnv =
          config.getOrThrow<Enviroment>('enviroment') === Enviroment.PRODUCTION;
        return {
          pinoHttp: {
            level: !!isProdEnv ? 'info' : 'debug',
            useLevelLabels: true,
            transport: isProdEnv
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({ useClass: ThrottlerConfigService }), // Request Limiter
    MailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
