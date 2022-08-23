import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { UserModel } from '../model/user.model';

export class CreateUserInput extends PickType(UserModel, [
  'email',
  'password',
]) {}
