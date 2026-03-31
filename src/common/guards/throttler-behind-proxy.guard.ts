import { ExecutionContext, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected throwThrottlingException(ctx: ExecutionContext): void {
    throw new HttpException(
      'Too many requests to this route... Please wait a bit before send another request.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  protected getTracker(req: Record<string, any>): string {
    if (!!req.clientIp) {
      return req.clientIp;
    }
    return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
  }
}
