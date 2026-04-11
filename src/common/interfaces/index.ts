export interface MailRecipients {
  suggestion: string;
  contact: string;
  // new_client: string;

  // Pagina Web
  contact_web: string;
  new_reservation: string;
}

export interface MailAttachment {
  filename: string;
  content?: any;
  path?: string;
  contentType?: string;
  cid?: string;
  encoding?: string;
  contentDisposition?: 'attachment' | 'inline' | undefined;
  href?: string;
}

export interface SanitizedException {
  readonly httpCode: number;
  readonly error: string;
  readonly message: string;
}

export interface StandardExceptionResponse {
  readonly method: string;
  readonly path: string;
  readonly code: number;
  readonly error: string;
  readonly message: string;
  readonly timestamp: string;
}
