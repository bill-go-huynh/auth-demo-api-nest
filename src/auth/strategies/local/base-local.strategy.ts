import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from '@auth/auth.service';
import { UserPayload } from '@auth/types/auth.types';

export class LocalStrategyHelper {
  static getStrategyOptions(): { usernameField: string } {
    return {
      usernameField: 'email',
    };
  }

  static async validate(
    authService: AuthService,
    email: string,
    password: string,
  ): Promise<UserPayload> {
    const user = await authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
