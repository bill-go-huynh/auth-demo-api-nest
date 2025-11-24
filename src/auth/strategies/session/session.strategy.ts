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

    // If not, manually deserialize from session
    // Passport stores serialized user in req.session.passport.user
    const session = req.session as { passport?: { user?: UserPayload } };
    if (session?.passport?.user) {
      // Set req.user for consistency
      req.user = session.passport.user;
      return session.passport.user;
    }

    return null;
  }
}
