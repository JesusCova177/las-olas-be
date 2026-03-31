import * as Joi from 'joi';

export const JoiSchemaValidation = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().default(5000),
  ALLOWED_ORIGINS: Joi.string().required(),

  // Validate Mails
  MAIL_RECIPIENT_CONTACT: Joi.string().required(),
  MAIL_RECIPIENT_SUGGESTION: Joi.string().required(),
  // MAIL_RECIPIENT_NEW_CLIENT: Joi.string().required(),
  MAIL_RECIPIENT_CONTACT_WEB: Joi.string().required(),
  MAIL_RECIPIENT_NEW_RESERVATION: Joi.string().required(),

  // Mailing
  MAILER_HOST: Joi.string().required(),
  MAILER_PORT: Joi.number().required(),
  MAILER_IGNORE_TLS: Joi.boolean().default(true),
  MAILER_SECURE: Joi.boolean().required(),
  MAILER_USER: Joi.string().required(),
  MAILER_PWD: Joi.string().required(),
  MAILER_DEFAULT_FROM: Joi.string().required(),
});
