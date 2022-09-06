import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { UserTokenEntity } from "src/users/database/entities/tbl_user_token_entity";


export class AuthenticationOutput  extends PickType(UserTokenEntity, []){
  @ApiProperty( { type: String, required: true, description: 'JWT' } )
  @Expose()
  accessToken!: string;

  @ApiProperty( { type: String, required: true, default: 'Bearer' } )
  @Expose()
  tokenType!: string;

  @ApiProperty( { type: Number, required: true } )
  @Expose()
  expiresIn!: number;

  @ApiProperty( { type: String, required: true, description: 'JWT' } )
  @Expose()
  refreshToken!: string;

  @ApiProperty( { type: String, required: true, description: 'redirectUrl' } )
  @Expose()
  redirectUrl?: string;
}