import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { KHSErrorCode } from 'src/common/exception/error_code';
import { KHSException } from 'src/common/exception/exception_model';
import { Payload } from 'src/common/payload';
import { KHSConfigService } from 'src/config/capa-config.service';
import { UserEntity } from 'src/users/database/entities/tbl_user_entity';
import { UserRepository } from 'src/users/database/repositories/tbl_user.repository';
import { UserDeviceTokenRepository } from 'src/users/database/repositories/tbl_user_token_repository';
import { EntityManager, Repository } from 'typeorm';
import { AuthenticationInput } from './dto/input/authenticate.input';
import * as jwt from 'jsonwebtoken';
import { CreateUserInput } from './dto/input/create_user.input';
import { ReCreateAccessTokenInput, TokenRefreshInput } from './dto/input/token_refresh_input';
import { plainToClass } from 'class-transformer';
import { AuthenticationOutput } from './dto/output/authentication.output';
import { CommonUserType } from 'src/common/common_type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(UserDeviceTokenRepository)
    private readonly userDeviceTokenRepository: UserDeviceTokenRepository,
    private readonly configService: KHSConfigService,
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
      now,
      exp,
    );

    const tokenType = 'Bearer';
    const expiresIn = exp.unix();
    const refreshToken = await this.createRefreshToken(now);
    
    const result = plainToClass(AuthenticationOutput,{
      accessToken!: accessToken,
      tokenType!: tokenType,
      expiresIn!: expiresIn,
      refreshToken!: refreshToken,
    })
    // user device 에 userid랑 같이 넣기

    return result;
  }

  async authenticate(
    input: AuthenticationInput,
    entityManager: EntityManager,
  ): Promise<AuthenticationOutput> {
    const userRepository = entityManager.getRepository(UserEntity);

    const user: UserEntity = await userRepository.findOne({
      email: input.email,
    });

    if (user == null) {
      throw new KHSException(KHSErrorCode.USER_NOT_FOUND);
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

    const data = {
      accessToken: await this.createAccessToken(now, exp),
      tokenType: 'Bearer',
      expiresIn: exp.unix(),
      refreshToken: await this.createRefreshToken(now),
      redirectUrl: '',
    } as AuthenticationOutput
    return data;
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
      throw new KHSException(KHSErrorCode.TOKEN_EXPIRED, 7830);
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
      throw new KHSException(KHSErrorCode.USER_NOT_FOUND);
    }

    const now = dayjs();
    const exp = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    const accessToken: string = await this.createAccessToken(
      now,
      exp,
    );

    const refreshToken: string = await this.createRefreshToken(
      now,
    );

    if (accessToken == null || refreshToken == null) {
      throw new KHSException(KHSErrorCode.ERROR);
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
    now: dayjs.Dayjs,
    exp: dayjs.Dayjs,
  ): Promise<string> {
    const scopes: CommonUserType[] = [];
    scopes.push(CommonUserType.USER);

    return jwt.sign(
      {
        iss: 'khs.ai',
        sub: 'access',
        iat: now.unix(),
        exp: exp.unix(),
        aud: CommonUserType.USER,
        scope: CommonUserType.USER,
        scopes: scopes,
      } as Payload,
      this.configService.jwtSecret,
    );
  }

  private async createRefreshToken(iat: dayjs.Dayjs): Promise<string> {
    return jwt.sign(
      {
        iss: 'khs.ai',
        sub: 'refresh',
        iat: iat.unix(),
        exp: iat
          .add(
            this.configService.refreshTokenExprieTimeValue,
            this.configService.refreshTokenExpireTimeUnit,
          )
          .unix(),
        aud: CommonUserType.USER,
        scope: CommonUserType.USER,
      } as Payload,
      this.configService.jwtSecret,
    );
  }
}
