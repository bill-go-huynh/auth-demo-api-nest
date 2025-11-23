import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@auth/auth.service';
import { UserPayload } from '@auth/types/auth.types';

@Injectable()
export abstract class BaseLocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly authService: AuthService,
    strategyName: string,
  ) {
    super(
      {
        usernameField: 'email',
      },
      strategyName,
    );
  }

  async validate(email: string, password: string): Promise<UserPayload> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
