import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ResendTransport } from '@documenso/nodemailer-resend';

import * as moment from 'moment';
import { isString } from 'class-validator';
import { EntityType } from 'src/common/enums';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    const username = this.configService.getOrThrow<string>('mailer_user');
    const defaultFrom = this.configService.getOrThrow<string>('mailer_default_from');
    return {
      transport: ResendTransport.makeTransport({
        apiKey: this.configService.getOrThrow<string>('mailer_pwd'),
      }),
      // preview: configService.get<string>('enviroment') === 'dev',
      defaults: {
        from: `"${defaultFrom}" <${username}>`,
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter({
          isdefined: function (value) {
            return value !== undefined && value !== null && value !== '';
          },
          isEntityType: function (currentValue, comparisonValue) {
            return currentValue === comparisonValue;
          },
          asEntityTypeName: function (value) {
            if (value === EntityType.Corporation) {
              return 'CORPORATIVO';
            } else if (value === EntityType.Turist) {
              return 'TURISTA';
            }
            return value ?? '????';
          },
          titleCase: function (value) {
            if (isString(value)) {
              const str = value.toLowerCase().split(' ');
              for (let i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
              }
              return str.join(' ');
            }
            return value ?? '????';
          },
          titleCaseGuiones: function (value) {
            if (isString(value)) {
              const str = value.toLowerCase().split('-');
              for (let i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
              }
              return str.join(' ');
            }
            return value ?? '????';
          },
          asBeatifulDate: function (value) {
            try {
              const date = moment(value);
              return date.format('DD/MM/YYYY');
            } catch (error) {}
            return value;
          },
        }),
        options: {
          strict: true,
        },
      },
    };
  }
}
