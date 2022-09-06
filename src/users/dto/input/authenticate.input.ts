import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { UserEntity } from 'src/users/database/entities/tbl_user_entity';
import { UserTokenEntity } from 'src/users/database/entities/tbl_user_token_entity';

export class AuthenticationInput extends PickType(UserEntity, ['email','password']) {
  @ApiProperty( { required: false })
  @Expose()
  @IsOptional()
  deviceToken?: string;
}
