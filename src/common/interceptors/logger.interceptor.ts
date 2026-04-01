import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Logger as NestLogger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { RequestContext } from '../types/request-context.type';

export class LoggerInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<
      Request & { requestContext?: RequestContext }
    >();
    const requestContext = request.requestContext;

    if (!requestContext) {
      return next.handle();
    }
    const { startTime, uuid, type, path, ip, method, baseUrl } = requestContext;

    NestLogger.log(`${method} ${baseUrl}${path} ${ip} ${uuid}`, type);

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = http.getResponse<Response>();
        NestLogger.log(
          `${method} ${baseUrl}${path} ${statusCode} ${ip} ${uuid} - +${
            Date.now() - startTime
          }ms`,
          type,
        );
      }),
    );
  }
}
