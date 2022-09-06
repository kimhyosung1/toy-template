import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KHSConfigModule } from './config/capa-config.module';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './users/user.module';
import { StrategyModule } from './gateway/strategy/strategy.module';

@Module({
  imports: [KHSConfigModule, StrategyModule, DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
