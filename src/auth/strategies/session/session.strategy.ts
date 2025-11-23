import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

import { UserPayload } from '@auth/types/auth.types';
import { SessionRequest } from '@auth/types/express.types';

@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy, 'session') {
  validate(req: SessionRequest): UserPayload | null {
    return req.user || null;
  }
}
