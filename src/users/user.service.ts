import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { ErrorCode } from 'src/common/error_code';
import { ToyException } from 'src/common/exception_model';
import { Payload } from 'src/common/payload';
import { CAPAConfigService } from 'src/config/capa-config.service';
import { UserEntity } from 'src/users/database/entities/tbl_user_entity';
import { UserRepository } from 'src/users/database/repositories/tbl_user.repository';
import { UserDeviceTokenRepository } from 'src/users/database/repositories/tbl_user_token_repository';
import { EntityManager, Repository } from 'typeorm';
import { AuthenticationInput } from './dto/input/authenticate.input';
import * as jwt from 'jsonwebtoken';
import { Test } from '@nestjs/testing';
import { CreateUserInput } from './dto/input/create_user.input';
import { ReCreateAccessTokenInput, TokenRefreshInput } from './dto/input/token_refresh_input';
import { plainToClass } from 'class-transformer';
import { AuthenticationOutput } from './dto/output/authentication.output';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(UserDeviceTokenRepository)
    private readonly userDeviceTokenRepository: UserDeviceTokenRepository,
    private readonly configService: CAPAConfigService,
  ) {}

  async getUser(): Promise<UserEntity> {
    const user = await this.userRepository.findOne();
    return user;
  }

  async getUsers(): Promise<UserEntity[]> {
    // todo:: 오픈할 정보만 추려야함!
    const users = await this.userRepository.find();
    return users;
  }

  async createUser(
    input: CreateUserInput,
    entityManager: EntityManager,
  ): Promise<AuthenticationOutput> {
    const userRepository = entityManager.getRepository(UserEntity);

    const user = await this.userRepository.save(
      this.userRepository.create({
        email: input.email,
        password: input.password,
      }),
    );

    const now: dayjs.Dayjs = dayjs();
    const exp: dayjs.Dayjs = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    const accessToken = await this.createAccessToken(
      'khs.ai',
      user,
      now,
      exp,
      userRepository,
    );

    const tokenType = 'Bearer';
    const expiresIn = exp.unix();
    const refreshToken = await this.createRefreshToken('capa.ai', user, now);
    
    const result = plainToClass(AuthenticationOutput,{
      accessToken!: accessToken,
      tokenType!: tokenType,
      expiresIn!: expiresIn,
      refreshToken!: refreshToken,
    })

    return result;
  }

  async authenticate(
    input: AuthenticationInput,
    entityManager: EntityManager,
  ): Promise<UserEntity> {
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
      const userDeviceTokenRepository: UserDeviceTokenRepository =
        entityManager.getCustomRepository<UserDeviceTokenRepository>(
          UserDeviceTokenRepository,
        );

      let deviceToken = await userDeviceTokenRepository.findOne({
        userId: user.id,
        deviceToken: input.deviceToken,
      });

      if (deviceToken == null)
        deviceToken = userDeviceTokenRepository.create({
          userId: user.id,
          deviceToken: input.deviceToken,
        });

      await userDeviceTokenRepository.save(deviceToken);
    }

    const accessToken = await this.createAccessToken(
      'khs.ai',
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

  async refreshAccessToken(
    input: TokenRefreshInput,
    entityManager: EntityManager,
  ): Promise<AuthenticationOutput> {
    const payload: Payload = jwt.verify(
      input.refreshToken,
      this.configService.jwtSecret,
    ) as Payload;
    if (payload.exp < dayjs().unix()) {
      throw new ToyException(ErrorCode.TOKEN_EXPIRED, 7830);
    }

    return this.recreateAccessToken(
      {
        email: payload.aud,
      } as ReCreateAccessTokenInput,
      entityManager,
    );
  }
  
  private async recreateAccessToken(
    input: ReCreateAccessTokenInput,
    entityManager: EntityManager,
  ): Promise<AuthenticationOutput> {
    const userRepository = entityManager.getRepository(UserEntity);

    const user: UserEntity = await userRepository.findOne({
      email: input.email,
    });

    if (user == null) {
      throw new ToyException(ErrorCode.USER_NOT_FOUND);
    }

    const now = dayjs();
    const exp = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    const accessToken: string = await this.createAccessToken(
      'khs.ai',
      user,
      now,
      exp,
      userRepository,
    );

    const refreshToken: string = await this.createRefreshToken(
      'khs.ai',
      user,
      now,
    );

    if (accessToken == null || refreshToken == null) {
      throw new ToyException(ErrorCode.ERROR);
    }

    const tokenType = 'Bearer'
    const expiresIn = exp.unix()

    const result = plainToClass(AuthenticationOutput,{
      accessToken!: accessToken,
      tokenType!: tokenType,
      expiresIn!: expiresIn,
      refreshToken!: refreshToken,
    })
  
    return result
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
        iss: iss ? iss : 'khs.ai',
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
        iss: iss ? iss : 'khs.ai',
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
