import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from '../jwt-auth.service';
import { UserPayload } from '../../types/auth.types';

@Injectable()
export class LocalJwtStrategy extends PassportStrategy(Strategy, 'local-jwt') {
  constructor(private readonly jwtAuthService: JwtAuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserPayload> {
    const user = await this.jwtAuthService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
