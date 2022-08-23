import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/users/database/entities/tbl_user_entity';

export class CreateUserInput extends PickType(UserEntity, [
  'email',
  'password',
]) {}
