import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { UserStatus } from 'src/common/common_type';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_user')
export class UserEntity extends BaseEntity {
  /**
   * id
   *
   * @description uuid_generate_v4()
   */
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: '카파 유저 아이디',
  })
  @ApiProperty( { type: String, required: false } )
  @Length(6, 320)
  @IsString()
  @Expose()
  id!: string;

  /**
   * seq
   *
   * @description bigserial or nextval('<seq>'::regclass)
   */
  @Column({ name: 'seq', type: 'int8', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  @ApiProperty( { type: Number, required: false } )
  @Expose()
  seq!: number;

  /**
   * email
   */
  @Column({
    name: 'email',
    type: 'varchar',
    length: 320,
    comment: '이메일 (로그인 아이디)',
  })
  @Index({
    unique: true,
    where: `status != 'DELETED'`,
  })
  @ApiProperty( { type: String, required: false } )
  @Length(6, 320)
  @IsString()
  @Expose()
  email!: string;

  /**
   * password
   */
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    comment: '패스워드 argon2',
  })
  @ApiProperty( { type: String, required: false } )
  @Expose()
  password!: string;

  /**
   * status
   *
   * @see {CAPAUserStatus}
   */
  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    default: UserStatus.REGISTERED,
    comment: '상태 CAPAUserStatus',
  })
  @ApiProperty( { type: UserStatus, required: false } )
  @Expose()
  status!: UserStatus;

  /**
   * lastLoginAt
   */
  @Column({
    name: 'last_login_at',
    type: 'timestamptz',
    nullable: true,
    comment: '마지막 로그인 시간',
  })
  @ApiProperty( { type: Date, required: true } )
  @Expose()
  lastLoginAt?: Date;

  /**
   * lastLogoutAt
   */
  @Column({
    name: 'last_logout_at',
    type: 'timestamptz',
    nullable: true,
    comment: '마지막 로그아웃 시간',
  })
  @ApiProperty( { type: Date, required: true } )
  @Expose()
  lastLogoutAt?: Date;

  /**
   * createdAt
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    comment: '생성일',
    update: false,
  })
  @ApiProperty( { type: Date, required: false } )
  @Expose()
  createdAt!: Date;

  /**
   * updatedAt
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    comment: '수정일',
  })
  @ApiProperty( { type: Date, required: false } )
  @Expose()
  updatedAt!: Date;
}
