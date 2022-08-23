import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_user_token')
export class UserTokenEntity extends BaseEntity {
  /**
   * id
   *
   * @description uuid_generate_v4()
   */
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: '아이디',
  })
  id!: string;

  /**
   * seq
   *
   * @description bigserial or nextval('<seq>'::regclass)
   */
  @Column({ name: 'seq', type: 'int8', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  seq!: number;

  /**
   * id
   *
   * @description uuid_generate_v4()
   */
  @Column('uuid', {
    name: 'user_id',
    comment: '유저 아이디',
  })
  userId!: string;

  /**
   * email
   */
  @Column({
    name: 'device_token',
    type: 'varchar',
    length: 1024,
    comment: '디바이스 토큰',
  })
  deviceToken!: string;

  /**
   * createdAt
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    comment: '생성일',
    update: false,
  })
  createdAt!: Date;

  /**
   * updatedAt
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    comment: '수정일',
  })
  updatedAt!: Date;
}
