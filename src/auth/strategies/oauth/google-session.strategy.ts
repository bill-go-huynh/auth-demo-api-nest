import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { GoogleStrategyHelper } from './base-google.strategy';

@Injectable()
export class GoogleSessionStrategy extends PassportStrategy(Strategy, 'google-session') {
  constructor(configService: ConfigService) {
    super(GoogleStrategyHelper.getStrategyOptions(configService, '/auth/google/session/callback'));
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
