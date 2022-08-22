import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/database/entities/tbl_user_entity';

import { UserService } from './user.service';

@ApiTags('khs')
@Controller('khs')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // async getHello(): Promise<string> {
  //   return this.userService.getHello();
  // }

  @Get()
  async getUser(): Promise<UserEntity> {
    await this.userService.createUser();

    return this.userService.getUser();
  }
}
