import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { KHSConfigModule } from 'src/config/capa-config.module';
import { KHSConfigService } from 'src/config/capa-config.service';

// import { CAPANamingStrategy } from '.';

async function ormConfig(): Promise<TypeOrmModuleOptions> {
  const cli = await NestFactory.create<NestExpressApplication>(
    KHSConfigModule,
  );
  cli.useGlobalPipes(new ValidationPipe());

  const config: KHSConfigService =
    cli.get<KHSConfigService>(KHSConfigService);

  const ormConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbDatabase,
    schema: config.dbSchema,
    keepConnectionAlive: true,
    entities: [],
    migrations: [join(__dirname, 'migrations/v1/*.{ts, js}')],
    subscribers: [],
    synchronize: config.dbSync,
    logging: config.dbDebug,
    extra: {
      connectionLimit: 5,
    },
    // namingStrategy: new CAPANamingStrategy(),
  };

  return Promise.resolve(ormConfig);
}

export = ormConfig();
