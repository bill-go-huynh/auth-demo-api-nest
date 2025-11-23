import { UserPayload, JwtPayload, GoogleProfile } from './auth.types';

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
  const emails = profile.emails;
  const name = profile.name;

  if (
    typeof id !== 'string' ||
    !Array.isArray(emails) ||
    typeof name !== 'object' ||
    name === null
  ) {
    return false;
  }

  const nameObj = name as Record<string, unknown>;
  const givenName = nameObj.givenName;
  const familyName = nameObj.familyName;
  const firstEmail = emails[0] as { value?: unknown } | undefined;

  return (
    typeof givenName === 'string' &&
    typeof familyName === 'string' &&
    emails.length > 0 &&
    typeof firstEmail?.value === 'string'
  );
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
