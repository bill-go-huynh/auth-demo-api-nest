import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserPayload } from '../types/auth.types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserPayload> {
    const result = await this.authService.validateUser(email, password);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const validatedResult = result as UserPayload;
    const user: UserPayload = validatedResult;
    return user;
  }
}
