import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonUserType } from 'src/common/common_type';
import { DefaultException } from 'src/common/exception/new-custom-exception';
import { TransactionBlock } from 'src/common/transaction';
import { ScopedAuth } from 'src/gateway/decorator/scoped-auth.decorator';
import { UserEntity } from 'src/users/database/entities/tbl_user_entity';
import { AuthenticationInput } from './dto/input/authenticate.input';
import { CreateUserInput } from './dto/input/create_user.input';
import { TokenRefreshInput } from './dto/input/token_refresh_input';
import { AuthenticationOutput } from './dto/output/authentication.output';

import { UserService } from './user.service';

@ApiTags('users')
@Controller('khs')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /** @function getUser
 * @return {UserEntity}
 */
  @ApiBearerAuth('Authorization')
  @ApiResponse(DefaultException.UNAUTHORIZED.getResponse())
  @ApiResponse(DefaultException.TOKEN_EXPIRED.getResponse())
  @ApiResponse(DefaultException.INVALID_TOKEN.getResponse())
  @ScopedAuth([CommonUserType.USER,CommonUserType.ADMIN])
  @ApiOperation({
    summary: '유저 찾기',
  })
  @Get()
  async getUser(): Promise<UserEntity> {
    return this.userService.getUser();
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: '유저 입력',
  })
  @ApiResponse(DefaultException.UNAUTHORIZED.getResponse())
  @ApiResponse(DefaultException.TOKEN_EXPIRED.getResponse())
  @ApiResponse(DefaultException.INVALID_TOKEN.getResponse())
  @ScopedAuth([CommonUserType.ADMIN])
  @Post('/create')
  async createUser(@Body() input: CreateUserInput): Promise<AuthenticationOutput> {
    return await TransactionBlock(async (entityManager) => {
      return await this.userService.createUser(
        input as CreateUserInput,
        entityManager,
      );
    });
  }

  @ApiOperation({
    summary: '유저 인증',
  })
  @Post('/login')
  async authenticate(@Body() input: AuthenticationInput): Promise<AuthenticationOutput> {
    return await TransactionBlock(async (entityManager): Promise<AuthenticationOutput> => {
      return await this.userService.authenticate(
        input as AuthenticationInput,
        entityManager,
      );
    });
  }

  @ApiOperation({
    summary: '토큰 갱신',
  })
  @Post('/refresh')
  async refresh (@Body() input: TokenRefreshInput): Promise<AuthenticationOutput> {
    return await TransactionBlock(async (entityManager): Promise<AuthenticationOutput> => {
      return await this.userService.refreshAccessToken(
        input as TokenRefreshInput,
        entityManager,
      );
    });
  }
}
