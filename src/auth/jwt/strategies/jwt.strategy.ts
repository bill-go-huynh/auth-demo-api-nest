import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../../types/auth.types';
import { isJwtPayload } from '../../types/type-guards';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: unknown): UserPayload {
    if (!isJwtPayload(payload)) {
      throw new Error('Invalid JWT payload');
    }
    const userPayload: UserPayload = { id: payload.sub, email: payload.email };
    return userPayload;
  }
}
