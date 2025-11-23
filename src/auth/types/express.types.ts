import { Request } from 'express';
import { UserPayload, GoogleUserProfile } from './auth.types';

export interface SessionRequest extends Request {
  user?: UserPayload;
  login: (user: UserPayload, callback: (err?: Error) => void) => void;
  session: {
    destroy: (callback: (err?: Error) => void) => void;
  };
  isAuthenticated?: () => boolean;
}

export interface GoogleOAuthRequest extends Request {
  user: GoogleUserProfile;
}
