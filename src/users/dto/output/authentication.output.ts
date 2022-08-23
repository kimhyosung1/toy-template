import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AuthenticationOutput {
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
}