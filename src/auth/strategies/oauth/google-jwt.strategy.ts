import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseGoogleStrategy } from './base-google.strategy';

@Injectable()
export class GoogleJwtStrategy extends BaseGoogleStrategy {
  constructor(configService: ConfigService) {
    super(configService, 'google-jwt', '/auth/google/jwt/callback');
  }
}
