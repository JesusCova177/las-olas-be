import { parseEnviroment } from 'src/common/enums';

export const AppConfiguration = () => ({
  enviroment: parseEnviroment(process.env.NODE_ENV || 'dev'),
  port: +process.env.PORT || 5000,
  allowed_origins: !!process.env?.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.includes(',')
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [process.env.ALLOWED_ORIGINS]
    : ['http://localhost', 'http://127.0.0.1'],

  // Mails
  recipients: {
    suggestion: process.env.MAIL_RECIPIENT_SUGGESTION,
    contact: process.env.MAIL_RECIPIENT_CONTACT,
    // new_client: process.env.MAIL_RECIPIENT_NEW_CLIENT,

    // Pagina Web
    contact_web: process.env.MAIL_RECIPIENT_CONTACT_WEB,
    new_reservation: process.env.MAIL_RECIPIENT_NEW_RESERVATION,
    new_reservation_second: process.env.MAIL_RECIPIENT_NEW_RESERVATION_SECOND,
  },

  // Mailing
  mailer_host: process.env.MAILER_HOST,
  mailer_port: process.env.MAILER_PORT,
  mailer_ignore_tls: process.env.MAILER_IGNORE_TLS || true,
  mailer_secure: process.env.MAILER_SECURE,
  mailer_user: process.env.MAILER_USER,
  mailer_pwd: process.env.MAILER_PWD,
  mailer_default_from: process.env.MAILER_DEFAULT_FROM,
});
