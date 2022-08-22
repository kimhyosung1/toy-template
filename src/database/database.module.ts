import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CAPAConfigService } from 'src/config/capa-config.service';
import { getMetadataArgsStorage } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (
        config: CAPAConfigService,
      ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUsername,
        password: config.dbPassword,
        database: config.dbDatabase,
        schema: config.dbSchema,
        keepConnectionAlive: true,
        entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
        migrations: [],
        subscribers: [],
        synchronize: config.dbSync,
        logging: config.dbDebug,
        extra: {
          max: 15,
          maxUses: 5000,
          connectionTimeoutMillis: 5000,
          idleTimeoutMillis: 1000,
        },
        // namingStrategy: new CAPANamingStrategy(),
      }),
      inject: [CAPAConfigService],
    }),
  ],
})
export class DatabaseModule {}
