import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { UserModel } from '../model/user.model';

export class AuthenticationInput extends UserModel {
  @ApiProperty()
  @Expose()
  @IsOptional()
  deviceToken?: string;
}
