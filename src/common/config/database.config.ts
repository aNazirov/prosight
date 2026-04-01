import { ConfigType, registerAs } from '@nestjs/config';

export const DATABASE_CONFIG_TOKEN = Symbol('DATABASE_CONFIG_TOKEN');

export const databaseConfig = registerAs(DATABASE_CONFIG_TOKEN, () => ({
  host: process.env.DB_HOST ?? 'hh-pgsql-public.ebi.ac.uk',
  port: Number(process.env.DB_PORT ?? 5432),
  name: process.env.DB_NAME ?? 'pfmegrnargs',
  username: process.env.DB_USERNAME ?? 'reader',
  password: process.env.DB_PASSWORD ?? 'NWDMCE5xdipIjRrp',
}));

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
