import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum } from 'class-validator';
import { ManipulateType } from 'dayjs';
import { LoggerOptions } from 'typeorm';

export enum Environment {
  DEFAULT = '',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
  DOCKER = 'docker',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

@Injectable()
export class CAPAConfigService {
  constructor(private readonly configService: ConfigService) {}

  @IsEnum(Environment)
  get nodeEnv(): Environment {
    return this.configService.get<Environment>(
      'NODE_ENV',
      Environment.PRODUCTION,
    );
  }

  get logLevel(): 'debug' | 'info' | 'warn' | 'error' | 'silent' {
    return this.configService.get<
      'debug' | 'info' | 'warn' | 'error' | 'silent'
    >('LOG_LEVEL', 'info');
  }

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get dbPort(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME', 'postgres');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD', 'postgres');
  }

  get dbDatabase(): string {
    return this.configService.get<string>('DB_DATABASE', 'khs');
  }

  get dbSchema(): string {
    return this.configService.get<string>('DB_SCHEMA', 'khs_schemas');
  }

  get dbSync(): boolean {
    return this.configService.get<boolean>('DB_SYNC', true);
  }

  get dbDebug(): LoggerOptions {
    return this.configService.get<LoggerOptions>(
      'DB_DEBUG',
      <LoggerOptions>'error',
    );
  }

  get jwtSecret(): string {
    return this.configService.get<string>(
      'JWT_SECRET',
      'd00c3244f80e5d7dcb635e596f114ab1f5c68d57',
    );
  }

  get accessTokenExprieTimeValue(): number {
    return this.configService.get<number>('ACCESS_TOKEN_EXPIRE_TIME_VALUE', 30);
  }

  get accessTokenExpireTimeUnit(): ManipulateType {
    return this.configService.get<ManipulateType>(
      'ACCESS_TOKEN_EXPIRE_TIME_UNIT',
      'minute',
    );
  }

  get refreshTokenExprieTimeValue(): number {
    return this.configService.get<number>('REFRESH_TOKEN_EXPIRE_TIME_VALUE', 1);
  }

  get refreshTokenExpireTimeUnit(): ManipulateType {
    return this.configService.get<ManipulateType>(
      'REFRESH_TOKEN_EXPIRE_TIME_UNIT',
      <ManipulateType>'month',
    );
  }

  get accessBOTokenExprieTimeValue(): number {
    return this.configService.get<number>(
      'BO_ACCESS_TOKEN_EXPIRE_TIME_VALUE',
      200,
    );
  }

  get accessBOTokenExpireTimeUnit(): ManipulateType {
    return this.configService.get<ManipulateType>(
      'BO_ACCESS_TOKEN_EXPIRE_TIME_UNIT',
      'day',
    );
  }
}
