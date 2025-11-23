export interface UserPayload {
  id: string;
  email: string;
}

export interface GoogleProfile {
  id: string;
  emails: Array<{ value: string }>;
  name: {
    givenName: string;
    familyName: string;
  };
  photos?: Array<{ value: string }>;
}

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
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
