import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/tbl_user_entity';
import { UserRepository } from 'src/database/repositories/tbl_user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getHello(): Promise<string> {
    const uuid = await this.userRepository.findByUUID();
    return 'Hello World!';
  }

  async getUser(): Promise<UserEntity> {
    const user = await this.userRepository.findOne();
    return user;
  }

  async createUser(): Promise<UserEntity> {
    const uuid = await this.userRepository.findByUUID();

    const userEntity = await this.userRepository.save(
      this.userRepository.create({
        email: 'stop70899@naver.com',
        password: '123456789',
      }),
    );

    return userEntity;
  }
}
