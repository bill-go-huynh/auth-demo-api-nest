import { Injectable } from '@nestjs/common';

import { AuthService } from '@auth/auth.service';

import { BaseLocalStrategy } from './base-local.strategy';

@Injectable()
export class LocalSessionStrategy extends BaseLocalStrategy {
  constructor(authService: AuthService) {
    super(authService, 'local');
  }
}
