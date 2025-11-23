import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserPayload } from '@auth/types/auth.types';

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  login(user: UserPayload): TokenResponse {
    const payload = { email: user.email, sub: user.id };
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    if (!accessSecret || !refreshSecret) {
      throw new InternalServerErrorException('JWT secrets are not configured');
    }

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

    if (!accessSecret) {
      throw new InternalServerErrorException('JWT access secret is not configured');
    }

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
    };
  }
}
