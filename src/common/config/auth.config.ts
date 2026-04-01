import { ConfigType, registerAs } from '@nestjs/config';

export const AUTH_CONFIG_TOKEN = Symbol('AUTH_CONFIG_TOKEN');

export enum UserRole {
  Admin = 'admin',
  Normal = 'normal',
  Limited = 'limited',
}

export interface PredefinedUser {
  username: string;
  password: string;
  role: UserRole;
}

export const authConfig = registerAs(AUTH_CONFIG_TOKEN, () => ({
  jwtSecret: process.env.JWT_SECRET ?? 'super-secret-dev-key-change-me',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  users: [
    {
      username: process.env.ADMIN_USERNAME ?? 'admin',
      password: process.env.ADMIN_PASSWORD ?? 'admin123',
      role: UserRole.Admin,
    },
    {
      username: process.env.NORMAL_USERNAME ?? 'normal',
      password: process.env.NORMAL_PASSWORD ?? 'normal123',
      role: UserRole.Normal,
    },
    {
      username: process.env.LIMITED_USERNAME ?? 'limited',
      password: process.env.LIMITED_PASSWORD ?? 'limited123',
      role: UserRole.Limited,
    },
  ] as PredefinedUser[],
}));

export type AuthConfig = ConfigType<typeof authConfig>;
