import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KHSConfigModule } from 'src/config/capa-config.module';
import { KHSConfigService } from 'src/config/capa-config.service';
import { UserRepository } from 'src/users/database/repositories/tbl_user.repository';
import { UserDeviceTokenRepository } from 'src/users/database/repositories/tbl_user_token_repository';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    KHSConfigModule,
    TypeOrmModule.forFeature([UserRepository, UserDeviceTokenRepository]),
  ],
  controllers: [UserController],
  providers: [UserService, KHSConfigService],
  exports: [UserService],
})
export class UserModule {}
