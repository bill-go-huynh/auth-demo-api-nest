import { Injectable } from '@nestjs/common';

import { AuthService } from '@auth/auth.service';

import { BaseLocalStrategy } from './base-local.strategy';

@Injectable()
export class LocalJwtStrategy extends BaseLocalStrategy {
  constructor(authService: AuthService) {
    super(authService, 'local-jwt');
  }
}
