import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './business/auth/auth.module';
import { HealthModule } from './business/health/health.module';
import { LocusModule } from './business/locus/locus.module';
import { CommonModule } from './common/common.module';
import { ContextInterceptor } from './common/interceptors/context.interceptor';
import { ErrorInterceptor } from './common/interceptors/error-handler.interceptor';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';

@Module({
  imports: [CommonModule, HealthModule, AuthModule, LocusModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
