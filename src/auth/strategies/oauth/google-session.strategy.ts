import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { GoogleStrategyHelper } from './base-google.strategy';

@Injectable()
export class GoogleSessionStrategy extends PassportStrategy(Strategy, 'google-session') {
  constructor(configService: ConfigService) {
    const baseUrl = configService.get<string>('BASE_URL', 'http://localhost:8080');
    super(
      GoogleStrategyHelper.getStrategyOptions(
        configService,
        `${baseUrl}/auth/session/google/callback`,
      ),
    );
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
