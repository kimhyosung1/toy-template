import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { ErrorCode } from 'src/common/error_code';
import { ToyException } from 'src/common/exception_model';
import { Payload } from 'src/common/payload';
import { CAPAConfigService } from 'src/config/capa-config.service';
import { UserEntity } from 'src/database/entities/tbl_user_entity';
import { UserRepository } from 'src/database/repositories/tbl_user.repository';
import { UserDeviceTokenRepository } from 'src/database/repositories/tbl_user_token_repository';
import { EntityManager, Repository } from 'typeorm';
import { AuthenticationInput } from './dto/input/authenticate.input';
import * as jwt from 'jsonwebtoken';
import { Test } from '@nestjs/testing';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly userDeviceTokenRepository: UserDeviceTokenRepository,
    private readonly configService: CAPAConfigService,
  ) {}

  async authenticate(
    input: AuthenticationInput,
    entityManager: EntityManager,
  ): Promise<any> {
    const userRepository = entityManager.getRepository(UserEntity);

    const user: UserEntity = await userRepository.findOne({
      email: input.email,
    });

    if (user == null) {
      throw new ToyException(ErrorCode.USER_NOT_FOUND);
    }

    // if ((await argon2.verify(user.password, input.password)) === false) {
    //   throw new ToyException(ErrorCode.PASSWORD_INCORRECT);
    // }

    const now = dayjs();
    const exp = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    if (input.deviceToken != null) {
      const capaUserDeviceTokenRepository: UserDeviceTokenRepository =
        entityManager.getCustomRepository<UserDeviceTokenRepository>(
          UserDeviceTokenRepository,
        );

      let deviceToken = await capaUserDeviceTokenRepository.findOne({
        userId: user.id,
        deviceToken: input.deviceToken,
      });

      if (deviceToken == null)
        deviceToken = await capaUserDeviceTokenRepository.create({
          userId: user.id,
          deviceToken: input.deviceToken,
        });

      await capaUserDeviceTokenRepository.save(deviceToken);
    }

    const accessToken = await this.createAccessToken(
      'khs',
      user,
      now,
      exp,
      userRepository,
    );
    const tokenType = 'Bearer';
    const expiresIn = exp.unix();
    const refreshToken = await this.createRefreshToken('capa.ai', user, now);
  }

  async getUser(): Promise<UserEntity> {
    const user = await this.userRepository.findOne();
    return user;
  }

  async createUser(
    input: Test,
    entityManager: EntityManager,
  ): Promise<UserEntity> {
    const userRepository = entityManager.getRepository(UserEntity);

    const user = await this.userRepository.save(
      this.userRepository.create({
        email: 'stop70899@naver.com',
        password: '123456789',
      }),
    );

    const now: dayjs.Dayjs = dayjs();
    const exp: dayjs.Dayjs = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    const accessToken = await this.createAccessToken(
      'khs',
      user,
      now,
      exp,
      userRepository,
    );
    const tokenType = 'Bearer';
    const expiresIn = exp.unix();
    const refreshToken = await this.createRefreshToken('capa.ai', user, now);

    return user;
  }

  private async createAccessToken(
    iss: string,
    user: UserEntity,
    now: dayjs.Dayjs,
    exp: dayjs.Dayjs,
    userRepository: Repository<UserEntity>,
  ): Promise<string> {
    await userRepository.update(
      { id: user.id },
      {
        lastLoginAt: now.toDate(),
        lastLogoutAt: exp.toDate(),
      },
    );

    return jwt.sign(
      {
        iss: iss ? iss : 'khs',
        sub: 'access',
        iat: now.unix(),
        exp: exp.unix(),
        aud: user.email,
      } as Payload,
      this.configService.jwtSecret,
    );
  }

  private async createRefreshToken(
    iss: string,
    user: UserEntity,
    iat: dayjs.Dayjs,
  ): Promise<string> {
    return jwt.sign(
      {
        iss: iss ? iss : 'khs',
        sub: 'refresh',
        iat: iat.unix(),
        exp: iat
          .add(
            this.configService.refreshTokenExprieTimeValue,
            this.configService.refreshTokenExpireTimeUnit,
          )
          .unix(),
        aud: user.email,
      } as Payload,
      this.configService.jwtSecret,
    );
  }
}
