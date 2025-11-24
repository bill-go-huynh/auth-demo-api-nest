import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtStrategyHelper } from './base-jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super(
      JwtStrategyHelper.getStrategyOptions(
        configService,
        'JWT_REFRESH_SECRET',
        ExtractJwt.fromBodyField('refreshToken'),
      ),
    );
  }

  validate(payload: unknown) {
    return JwtStrategyHelper.validate(payload);
  }
}
