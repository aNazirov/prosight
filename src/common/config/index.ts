import { APP_CONFIG_TOKEN, appConfig, AppConfig } from './app.config';
import { AUTH_CONFIG_TOKEN, authConfig, AuthConfig } from './auth.config';
import {
  DATABASE_CONFIG_TOKEN,
  databaseConfig,
  DatabaseConfig,
} from './database.config';

export type GlobalConfig = {
  [APP_CONFIG_TOKEN]: AppConfig;
  [AUTH_CONFIG_TOKEN]: AuthConfig;
  [DATABASE_CONFIG_TOKEN]: DatabaseConfig;
};

export const configs = [appConfig, authConfig, databaseConfig];

export * from './app.config';
export * from './auth.config';
export * from './database.config';
