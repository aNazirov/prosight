import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import * as os from 'os';
import { AppModule } from './app.module';
import { APP_CONFIG_TOKEN, AppConfig, GlobalConfig } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.enableShutdownHooks();
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get<ConfigService<GlobalConfig>>(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>(APP_CONFIG_TOKEN);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Prosight API')
    .setDescription('API documentation for Prosight service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(appConfig.swaggerPath, app, swaggerDocument);

  const hostname = os.hostname();

  await app.listen(appConfig.port, '0.0.0.0', () => {
    new Logger('NestApplication').log(
      `🚀 Core server ready on ${appConfig.environment} mode at: ${hostname}:${appConfig.port}`,
    );
  });
}

void bootstrap();
