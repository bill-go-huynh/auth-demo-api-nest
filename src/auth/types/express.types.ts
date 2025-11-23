import type { Request } from 'express';

import type { GoogleUserProfile, UserPayload } from './auth.types';

export interface SessionRequest extends Omit<Request, 'session'> {
  user?: UserPayload;
  login: {
    (user: UserPayload, callback: (err?: Error) => void): void;
    (user: UserPayload, options: unknown, callback: (err?: Error) => void): void;
  };
  session: {
    destroy: (callback: (err?: Error) => void) => void;
  };
}

export interface GoogleOAuthRequest extends Request {
  user: GoogleUserProfile;
}
