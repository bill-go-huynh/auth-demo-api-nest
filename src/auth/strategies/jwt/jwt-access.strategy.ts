import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

import { BaseJwtStrategy } from './base-jwt.strategy';

@Injectable()
export class JwtAccessStrategy extends BaseJwtStrategy {
  constructor(configService: ConfigService) {
    super(configService, 'jwt', 'JWT_ACCESS_SECRET', ExtractJwt.fromAuthHeaderAsBearerToken());
  }
}
