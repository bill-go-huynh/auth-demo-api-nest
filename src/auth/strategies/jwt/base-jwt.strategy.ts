import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StrategyOptions } from 'passport-jwt';

import { UserPayload } from '@auth/types/auth.types';
import { isJwtPayload } from '@auth/types/type-guards';

export class JwtStrategyHelper {
  static getStrategyOptions(
    configService: ConfigService,
    secretKey: string,
    jwtFromRequest: StrategyOptions['jwtFromRequest'],
  ): StrategyOptions {
    const secret = configService.get<string>(secretKey);
    if (!secret) {
      throw new InternalServerErrorException(`${secretKey} is not configured`);
    }
    return {
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: secret,
    };
  }

  static validate(payload: unknown): UserPayload {
    if (!isJwtPayload(payload)) {
      throw new UnauthorizedException('Invalid JWT payload');
    }
    const userPayload: UserPayload = { id: payload.sub, email: payload.email };
    return userPayload;
  }
}
