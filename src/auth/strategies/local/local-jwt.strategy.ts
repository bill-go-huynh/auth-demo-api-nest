import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@auth/auth.service';

import { LocalStrategyHelper } from './base-local.strategy';

@Injectable()
export class LocalJwtStrategy extends PassportStrategy(Strategy, 'local-jwt') {
  constructor(private authService: AuthService) {
    super(LocalStrategyHelper.getStrategyOptions());
  }

  async validate(email: string, password: string) {
    return LocalStrategyHelper.validate(this.authService, email, password);
  }
}
