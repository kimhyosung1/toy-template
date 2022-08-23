import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionBlock } from 'src/common/transaction';
import { UserEntity } from 'src/database/entities/tbl_user_entity';
import { AuthenticationInput } from './dto/input/authenticate.input';

import { UserService } from './user.service';

@ApiTags('users')
@Controller('khs')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저 찾기',
  })
  @Get()
  async getUser(): Promise<UserEntity> {
    return this.userService.getUser();
  }

  @ApiOperation({
    summary: '유저 입력',
  })
  @Post()
  async createUser(input: AuthenticationInput): Promise<any> {
    await TransactionBlock(async (entityManager) => {
      return await this.userService.createUser(
        input as AuthenticationInput,
        entityManager,
      );
    });
  }

  @ApiOperation({
    summary: '유저 인증',
  })
  @Post()
  async authenticate(input: AuthenticationInput): Promise<any> {
    await TransactionBlock(async (entityManager) => {
      return await this.userService.authenticate(
        input as AuthenticationInput,
        entityManager,
      );
    });
  }
}
