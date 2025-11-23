import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseGoogleStrategy } from './base-google.strategy';

@Injectable()
export class GoogleSessionStrategy extends BaseGoogleStrategy {
  constructor(configService: ConfigService) {
    super(configService, 'google-session', '/auth/google/session/callback');
  }
}
