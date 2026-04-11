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
    // 1. Cargar destinatarios (Si esto falta en Railway, el servidor dará Error 500)
    try {
      this.recipients = this.configService.getOrThrow<MailRecipients>('recipients');
    } catch (error) {
      this.logger.error('ERROR: Faltan variables de MAIL_RECIPIENT en Railway');
    }

    // 2. BUSCADOR DINÁMICO DE RUTAS
    // Intentamos todas las combinaciones posibles de Railway y Local
    const possiblePaths = [
      join(process.cwd(), 'dist', 'templates'),
      join(process.cwd(), 'dist', 'src', 'templates'),
      join(__dirname, '..', 'templates'),
      join(__dirname, '..', '..', 'templates'),
    ];

    this.templatesRoot = possiblePaths.find((p) => existsSync(p)) || possiblePaths[0];
    this.logger.log(`Ruta de plantillas detectada: ${this.templatesRoot}`);

    // 3. CARGA SEGURA DE IMÁGENES
    this.initializeAttachments();
  }

  private initializeAttachments() {
    // Estas son las imágenes que tus archivos .hbs piden con "cid:"
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
        this.logger.warn(
          `Imagen faltante: ${img.filename}. Se enviará el correo sin ella.`,
        );
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
      // Verificamos si el template existe antes de enviarlo
      const templatePath = join(this.templatesRoot, `${options.template}.hbs`);
      if (!existsSync(templatePath)) {
        this.logger.error(`EL TEMPLATE NO EXISTE: ${templatePath}`);
      }

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
      this.logger.error(`Error en sendMail: ${error.message}`);
      throw error;
    }
  }
}
