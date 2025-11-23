import { GoogleProfile, JwtPayload, UserPayload } from './auth.types';

export function isUserPayload(value: unknown): value is UserPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  const id = obj.id;
  const email = obj.email;
  return typeof id === 'string' && typeof email === 'string' && id.length > 0 && email.length > 0;
}

export function isGoogleProfile(value: unknown): value is GoogleProfile {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const profile = value as Record<string, unknown>;
  const id = profile.id;
  const email = profile.email;
  const name = profile.name;

  if (
    typeof id !== 'string' ||
    typeof email !== 'string' ||
    typeof name !== 'object' ||
    name === null
  ) {
    return false;
  }

  const nameObj = name as Record<string, unknown>;
  const givenName = nameObj.givenName;
  const familyName = nameObj.familyName;

  return typeof givenName === 'string' && typeof familyName === 'string' && email.length > 0;
}

export function isJwtPayload(value: unknown): value is JwtPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  const sub = obj.sub;
  const email = obj.email;
  return typeof sub === 'string' && typeof email === 'string' && sub.length > 0 && email.length > 0;
}
