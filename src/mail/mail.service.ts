import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { existsSync } from 'fs';
import { MailRecipients } from './interfaces/mail-recipients.interface'; // Ajusta la ruta si es necesario

@Injectable()
export class MailService {
  private readonly recipients: MailRecipients;
  private readonly templatesRoot: string;
  private readonly attachments: any[];

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {
    // 1. Cargamos destinatarios
    this.recipients = this.configService.getOrThrow<MailRecipients>('recipients');

    // 2. BUSCADOR DE RUTAS (Solución para Railway)
    // Probamos las 3 rutas posibles donde NestJS podría haber puesto los .hbs
    const pathsToTry = [
      join(process.cwd(), 'dist', 'templates'),
      join(process.cwd(), 'dist', 'src', 'templates'),
      join(__dirname, '..', 'templates'),
    ];

    this.templatesRoot = pathsToTry.find((p) => existsSync(p)) || pathsToTry[0];

    // Log para que veas en Railway dónde encontró los archivos
    console.log('--- MAIL SERVICE CONFIG ---');
    console.log('Templates Path:', this.templatesRoot);

    // 3. CARGA SEGURA DE ADJUNTOS
    this.attachments = this.loadAttachments();
  }

  private loadAttachments() {
    // Definimos las imágenes que tus .hbs necesitan (cid:logo y cid:instagram)
    const images = [
      { filename: 'logo.png', cid: 'logo' },
      { filename: 'instagram.png', cid: 'instagram' },
    ];

    return images
      .map((img) => {
        const fullPath = join(this.templatesRoot, img.filename);
        if (existsSync(fullPath)) {
          return {
            filename: img.filename,
            path: fullPath,
            cid: img.cid,
          };
        }
        console.warn(`Imagen no encontrada: ${img.filename} en ${this.templatesRoot}`);
        return null;
      })
      .filter(Boolean); // Solo deja los que sí existen
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
        template: options.template, // Ejemplo: 'contact'
        context: options.context,
        attachments: this.attachments,
      });
      return { success: true };
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw error;
    }
  }

  // Si tienes otros métodos como sendContact, asegúrate de que usen sendMail de arriba
}
