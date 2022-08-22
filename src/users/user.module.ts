import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CAPAConfigModule } from 'src/config/capa-config.module';
import { UserRepository } from 'src/database/repositories/tbl_user.repository';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CAPAConfigModule, TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
