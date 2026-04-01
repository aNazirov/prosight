import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, throwError } from 'rxjs';
import { RequestContext } from '../types/request-context.type';

export class ErrorInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { requestContext?: RequestContext }>();
    const requestContext = request.requestContext;

    if (!requestContext) {
      return next.handle();
    }

    const { startTime, uuid, type, path, ip, method, baseUrl } = requestContext;

    return next.handle().pipe(
      catchError((error: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Logger.error(error.message, error.stack);

        const message = `${method} ${baseUrl}${path} ${ip} ${uuid} failed after +${
          Date.now() - startTime
        }ms`;

        return throwError(() => {
          Logger.error(message, type);

          if (error instanceof HttpException) {
            return error;
          }

          return new HttpException(
            (error as Error).message,
            HttpStatus.BAD_REQUEST,
            {
              cause: error,
            },
          );
        });
      }),
    );
  }
}
