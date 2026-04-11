import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { existsSync } from 'fs';
import { MailRecipients } from './interfaces/mail-recipients.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly recipients: MailRecipients;
  private readonly templatesRoot: string;
  private attachments: any[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {
    this.recipients = this.configService.getOrThrow<MailRecipients>('recipients');

    // 1. Buscador de rutas dinámico para Railway
    const possiblePaths = [
      join(process.cwd(), 'dist', 'templates'),
      join(process.cwd(), 'dist', 'src', 'templates'),
      join(__dirname, '..', 'templates'),
      join(__dirname, '..', '..', 'templates'),
    ];

    this.templatesRoot = possiblePaths.find((p) => existsSync(p)) || possiblePaths[0];

    this.logger.log(`Ruta de plantillas detectada: ${this.templatesRoot}`);

    // 2. Carga de adjuntos ultra-segura
    this.initializeAttachments();
  }

  private initializeAttachments() {
    const images = [
      { filename: 'logo.png', cid: 'logo' },
      { filename: 'instagram.png', cid: 'instagram' },
    ];

    this.attachments = images
      .map((img) => {
        const fullPath = join(this.templatesRoot, img.filename);
        if (existsSync(fullPath)) {
          return {
            filename: img.filename,
            path: fullPath,
            cid: img.cid,
          };
        }
        this.logger.warn(`Imagen faltante (se enviará sin ella): ${img.filename}`);
        return null;
      })
      .filter(Boolean);
  }

  async sendMail(options: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }) {
    try {
      await this.mailService.sendMail({
        to: options.to,
        from: this.configService.get('MAILER_DEFAULT_FROM') || 'onboarding@resend.dev',
        subject: options.subject,
        template: options.template,
        context: options.context,
        attachments: this.attachments,
      });
      return { success: true };
    } catch (error) {
      this.logger.error(`Error crítico al enviar correo: ${error.message}`);
      throw error;
    }
  }

  // Asegúrate de que tus métodos de contacto llamen a this.sendMail(...)
}
