import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { GoogleStrategyHelper } from './base-google.strategy';

@Injectable()
export class GoogleJwtStrategy extends PassportStrategy(Strategy, 'google-jwt') {
  constructor(configService: ConfigService) {
    super(GoogleStrategyHelper.getStrategyOptions(configService, '/auth/google/jwt/callback'));
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: VerifyCallback,
  ): void {
    return GoogleStrategyHelper.validate(accessToken, refreshToken, profile, done);
  }
}
