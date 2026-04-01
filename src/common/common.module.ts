import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import {
  AuthConfig,
  authConfig,
  configs,
  DatabaseConfig,
  databaseConfig,
} from './config/index';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env'],
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (database: DatabaseConfig) => ({
        type: 'postgres',
        host: database.host,
        port: database.port,
        username: database.username,
        password: database.password,
        database: database.name,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    JwtModule.registerAsync({
      inject: [authConfig.KEY],
      useFactory: (auth: AuthConfig) => ({
        secret: auth.jwtSecret,
        signOptions: {
          expiresIn: auth.expiresIn as StringValue,
        },
      }),
    }),
  ],
  exports: [ConfigModule, TypeOrmModule, JwtModule],
})
export class CommonModule {}
