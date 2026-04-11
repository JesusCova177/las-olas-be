import { basename, join } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import {
  CONTACT_NAME,
  SUGGESTION_NAME,
  CONTACT_WEB_NAME,
  NEW_RESERVATION_NAME, // NEW_CLIENT_NAME,
} from 'src/common/constants';
import { MailAttachment, MailRecipients } from 'src/common/interfaces';
import { recursiveDirFiles } from 'src/common/helpers';
import { EmailType } from 'src/common/enums';

import { MailDto } from 'src/common/dto/mail.dto';
import { ReserveMailDto } from './dto/reserve-mail.dto';

@Injectable()
export class MailService {
  private readonly templatesRoot: string;
  private readonly recipients: MailRecipients;
  private readonly attachments: MailAttachment[];

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {
    this.recipients = this.configService.getOrThrow<MailRecipients>('recipients');
    this.templatesRoot = join(__dirname, '..', 'templates');
    this.attachments = this.loadAttachments();
  }

  async sendContactMail(dto: MailDto): Promise<void> {
    console.log("starting service...", dto);
    if (dto.type === EmailType.Suggestion) {
      await this.sendMail(SUGGESTION_NAME, this.recipients.suggestion, dto);
    } else if (dto.type === EmailType.Contact) {
      await this.sendMail(CONTACT_NAME, this.recipients.contact, dto);
    } /* else if (dto.type === EmailType.NewClient) {
      await this.sendMail(NEW_CLIENT_NAME, this.recipients.new_client, dto);
    }*/ else if (dto.type === EmailType.ContactWeb) {
      await this.sendMail(CONTACT_WEB_NAME, this.recipients.contact_web, dto);
    } else if (dto.type === EmailType.NewReservation) {
      const reserveDto = dto as ReserveMailDto;
      // TODO: Better solution to remove extra properties from dto
      // if (reserveDto.entityType === EntityType.Turist) {
      //   const { jobTitle, companyName, ...rest } = reserveDto;
      //   await this.sendMail(NEW_RESERVATION_NAME, this.recipients.new_reservation, rest);
      //   return;
      // }
      const recipients = this.configService.getOrThrow<string>('MAIL_RECIPIENTS_NEW_RESERVATION');
      const recipientList = recipients.split(',').map(email => email.trim());

      console.log('Recipient List:', recipientList); // Asegurándote de que la lista esté correctamente formada

      // Enviar a todos los destinatarios
      await this.sendMail(
        NEW_RESERVATION_NAME,
        recipientList,
        reserveDto,
      );
    } else {
      throw new BadRequestException('Unexpected Email Type: ' + dto.type);
    }
  }

  private async sendMail(subject: string, to: string | string[], dto: MailDto) {
    console.log('Sending email to:', to);
    await this.mailService.sendMail({
      to,
      subject,
      template: dto.type,
      context: { ...dto },
      attachments: this.attachments,
    });
  }

  private loadAttachments() {
    return recursiveDirFiles(
      join(this.templatesRoot, 'images'),
      /^.(png|jpg|jpeg|svg)/,
    ).map((path: string): MailAttachment => {
      const filename = basename(path);
      return {
        filename,
        path,
        cid: filename.replace(' ', '-'),
        contentDisposition: 'inline',
      };
    });
  }
}
