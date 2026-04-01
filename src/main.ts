import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import * as os from 'os';
import { AppModule } from './app.module';
import { APP_CONFIG_TOKEN, AppConfig, GlobalConfig } from './common/config';
import { ErrorInterceptor } from './common/interceptors/error-handler.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useGlobalInterceptors(new ErrorInterceptor());
  app.enableShutdownHooks();
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const configService = app.get<ConfigService<GlobalConfig>>(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>(APP_CONFIG_TOKEN);

  const hostname = os.hostname();

  await app.listen(appConfig.port, '0.0.0.0', () => {
    new Logger('NestApplication').log(
      `🚀 Core server ready on ${appConfig.environment} mode at: ${hostname}:${appConfig.port}`,
    );
  });
}

void bootstrap();
