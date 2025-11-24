import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

import { UserPayload } from '@auth/types/auth.types';
import { SessionRequest } from '@auth/types/express.types';

@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy, 'session') {
  validate(req: SessionRequest): UserPayload | null {
    if (req.user) {
      return req.user;
    }

    const session = req.session as { passport?: { user?: UserPayload } };
    return session?.passport?.user || null;
  }
}
