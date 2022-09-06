import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { KHSConfigModule } from 'src/config/capa-config.module';
import { KHSConfigService } from 'src/config/capa-config.service';
import { JwtStrategy } from './jwt.strategy';


/**
 * @TODO check
 */

@Module({
  imports: [
    PassportModule.register({ defatulStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [KHSConfigModule],
      useFactory: async (config: KHSConfigService) => ({
        secret: config.jwtSecret,
      }),
      inject: [KHSConfigService],
    }),
  ],
  providers: [JwtStrategy],
})
export class StrategyModule {}
