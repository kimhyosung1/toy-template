import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '../entities/tbl_user_entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findById(id: string): Promise<UserEntity | undefined> {
    return await this.findOne({ id: id });
  }

  async findByUUID(): Promise<any> {
    const uuid = await this.query(
      `SELECT uuid_generate_v4() AS uuid_generate_v4`,
    );

    return uuid;
  }
}
