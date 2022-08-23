import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CAPAConfigModule } from './config/capa-config.module';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [CAPAConfigModule, DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
