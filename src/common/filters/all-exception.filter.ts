import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isString } from 'class-validator';
import { Response, Request } from 'express';

import { SanitizedException, StandardExceptionResponse } from '../interfaces';
import { Enviroment } from '../enums';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly isProduction: boolean;
  // private readonly isDevelopment: boolean;
  private readonly faultMessage: 'Something is wrong!! Check Server Logs for more...';

  constructor(config: ConfigService) {
    const enviroment = config.getOrThrow<string>('enviroment');
    this.isProduction = enviroment === Enviroment.PRODUCTION;
    // this.isDevelopment = enviroment === Enviroment.DEVELOPMENT;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const sanitizedException = this.getSanitizedException(exception);
    const data = this.buildStandardResponse(request, sanitizedException);
    response.status(data.code).json(data);
  }

  private buildStandardResponse(
    req: Request,
    { httpCode, error, message }: SanitizedException,
  ): StandardExceptionResponse {
    return {
      method: req.method,
      path: req.url,
      code: httpCode,
      error,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  private getSanitizedException(exception: HttpException | any): SanitizedException {
    if (exception instanceof HttpException) {
      if (isString(exception.getResponse())) {
        const { status, response, name } = exception as any;
        return this.sanifyException(status, response, name);
      }
      const { statusCode, message, error } = exception.getResponse() as any;
      return this.sanifyException(statusCode, message, error || exception.name);
    }
    return this.sanifyException(
      exception?.statusCode || exception?.status,
      exception?.message,
    );
  }

  private sanifyException(
    httpCode?: number,
    message?: string,
    error?: string,
  ): SanitizedException {
    return {
      httpCode: httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        !!this.isProduction && httpCode >= 500
          ? this.faultMessage
          : message || 'Something is wrong!! Check Server Logs!',
      error: error || 'Internal Server Error',
    };
  }
}
