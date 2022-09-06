import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from 'src/common/payload';
import { KHSConfigService } from 'src/config/capa-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: KHSConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: Payload) {
    if (payload.iss != 'khs.ai' && payload.iss != 'bo.khs.ai')
      return undefined;
    if (payload.aud == null) return undefined;
    return { email: payload.aud, scopes: payload.scopes };
  }
}
