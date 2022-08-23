import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { REGEX_PASSWORD } from 'src/common/capa-regular-expression';
import { BaseModel } from 'src/common/base_model';
import { UserStatus } from 'src/common/common_type';

export class UserModel extends BaseModel {
  @ApiProperty()
  @Length(6, 320)
  @IsString()
  @Expose()
  id?: string | null;

  @ApiProperty()
  @Length(6, 320)
  @IsString()
  @Expose()
  email?: string | null;

  @ApiProperty()
  @Length(8, 16)
  @IsString()
  @Matches(REGEX_PASSWORD, {
    message: 'INVALID_PASSWORD_RULE',
  })
  @ApiProperty()
  @Expose()
  password?: string | null;

  @ApiProperty()
  @Expose()
  status?: UserStatus | null;

  @ApiProperty()
  @Expose()
  lastLoginAt?: Date | null;

  @ApiProperty()
  @Expose()
  lastLogoutAt?: Date | null;
}
