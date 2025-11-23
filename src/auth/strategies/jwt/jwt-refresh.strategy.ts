import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

import { BaseJwtStrategy } from './base-jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends BaseJwtStrategy {
  constructor(configService: ConfigService) {
    super(
      configService,
      'jwt-refresh',
      'JWT_REFRESH_SECRET',
      ExtractJwt.fromBodyField('refreshToken'),
    );
  }
}
