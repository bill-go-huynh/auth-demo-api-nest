import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtStrategyHelper } from './base-jwt.strategy';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super(
      JwtStrategyHelper.getStrategyOptions(
        configService,
        'JWT_ACCESS_SECRET',
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ),
    );
  }

  validate(payload: unknown) {
    return JwtStrategyHelper.validate(payload);
  }
}
