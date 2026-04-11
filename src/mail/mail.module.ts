import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from 'src/config/mailer.config';

@Module({
  imports: [MailerModule.forRootAsync({ useClass: MailerConfigService })],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
