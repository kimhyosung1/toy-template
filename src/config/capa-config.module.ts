import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { CAPAConfigService, Environment } from './capa-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: [
        join(__dirname, '../..', `.env`),
        // join(__dirname, '../../..', `${Environment.DEVELOPMENT}.env`),
        // join(__dirname, '../../..', `${Environment.DOCKER}.env`),
        // join(__dirname, '../../..', `${Environment.LOCAL}.env`),
        // join(__dirname, '../../..', `${Environment.STAGING}.env`),
        // join(__dirname, '../../..', `${Environment.PRODUCTION}.env`),
        // join(__dirname, '../../../..', `${Environment.TEST}.env`),
      ],
    }),
  ],
  providers: [ConfigService, CAPAConfigService],
  exports: [ConfigService, CAPAConfigService],
})
export class CAPAConfigModule {}
