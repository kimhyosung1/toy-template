import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CAPAConfigModule } from 'src/config/capa-config.module';
import { CAPAConfigService } from 'src/config/capa-config.service';
import { UserRepository } from 'src/database/repositories/tbl_user.repository';
import { UserDeviceTokenRepository } from 'src/database/repositories/tbl_user_token_repository';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    CAPAConfigModule,
    TypeOrmModule.forFeature([UserRepository, UserDeviceTokenRepository]),
  ],
  controllers: [UserController],
  providers: [UserService, CAPAConfigService],
  exports: [UserService],
})
export class UserModule {}
