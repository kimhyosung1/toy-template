import { EntityRepository, Repository } from 'typeorm';
import { UserTokenEntity } from '../entities/tbl_user_token_entity';

@EntityRepository(UserTokenEntity)
export class UserDeviceTokenRepository extends Repository<UserTokenEntity> {}
