import { IsJWT, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenRefreshInput {
  @ApiProperty( { required: false })
  @IsJWT()
  @IsNotEmpty()
  @Expose()
  refreshToken!: string;
}

export class ReCreateAccessTokenInput {
  @ApiProperty( { required: false })
  @Expose()
  email!: string;
}
