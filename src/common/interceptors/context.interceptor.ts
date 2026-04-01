import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as crypto from 'crypto';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { RequestContext } from '../types/request-context.type';

export class ContextInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const startTime = Date.now();
    const request = context

      .switchToHttp()
      .getRequest<Request & { requestContext?: RequestContext }>();

    const { ip, method, path, baseUrl } = request;

    request.requestContext = {
      ip: ip ?? '',
      path,
      method,
      baseUrl,
      startTime,
      uuid: crypto.randomUUID(),
      type: context.getType().toUpperCase(),
    } satisfies RequestContext;

    return next.handle().pipe(
      tap(() => {
        request.requestContext = undefined;
      }),
    );
  }
}
