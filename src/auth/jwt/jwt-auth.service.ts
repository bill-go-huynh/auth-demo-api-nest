import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserPayload } from '../types/auth.types';

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  login(user: UserPayload): TokenResponse {
    const payload = { email: user.email, sub: user.id };
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    };
  }

  refresh(user: UserPayload): TokenResponse {
    const payload = { email: user.email, sub: user.id };
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
    };
  }

  async validateUser(email: string, password: string): Promise<UserPayload | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.validatePassword(user, password))) {
      return {
        id: user.id,
        email: user.email,
      };
    }
    return null;
  }
}
