import type { Request } from 'express';

export interface UserPayload {
  id: string;
  email: string;
}

export interface GoogleProfile {
  id: string;
  email: string;
  name: {
    givenName: string;
    familyName: string;
  };
}

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  name: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
