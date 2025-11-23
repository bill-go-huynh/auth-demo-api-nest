import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-jwt';

import { UserPayload } from '@auth/types/auth.types';
import { isJwtPayload } from '@auth/types/type-guards';

@Injectable()
export abstract class BaseJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService,
    strategyName: string,
    secretKey: string,
    jwtFromRequest: StrategyOptions['jwtFromRequest'],
  ) {
    const secret = configService.get<string>(secretKey);
    if (!secret) {
      throw new InternalServerErrorException(`${secretKey} is not configured`);
    }
    super(
      {
        jwtFromRequest,
        ignoreExpiration: false,
        secretOrKey: secret,
      },
      strategyName,
    );
  }

  validate(payload: unknown): UserPayload {
    if (!isJwtPayload(payload)) {
      throw new UnauthorizedException('Invalid JWT payload');
    }
    const userPayload: UserPayload = { id: payload.sub, email: payload.email };
    return userPayload;
  }
}
