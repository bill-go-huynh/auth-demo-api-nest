import { UserPayload, GoogleProfile } from './auth.types';

export function extractUserPayload(value: unknown): UserPayload {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Invalid user payload');
  }
  const obj = value as Record<string, unknown>;
  const id = obj.id;
  const email = obj.email;
  if (typeof id !== 'string' || typeof email !== 'string') {
    throw new Error('Invalid user payload');
  }
  const result: UserPayload = { id, email };
  return result;
}

export function extractGoogleProfile(value: unknown): GoogleProfile {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Invalid Google profile');
  }
  const profile = value as Record<string, unknown>;
  const id = profile.id;
  const emails = profile.emails;
  const name = profile.name;
  const photos = profile.photos;

  if (
    typeof id !== 'string' ||
    !Array.isArray(emails) ||
    typeof name !== 'object' ||
    name === null
  ) {
    throw new Error('Invalid Google profile');
  }

  const nameObj = name as Record<string, unknown>;
  const givenName = nameObj.givenName;
  const familyName = nameObj.familyName;

  if (typeof givenName !== 'string' || typeof familyName !== 'string') {
    throw new Error('Invalid Google profile');
  }

  const emailArray: Array<{ value: string }> = emails as Array<{ value: string }>;
  const photosArray: Array<{ value: string }> | undefined = photos as
    | Array<{ value: string }>
    | undefined;

  const result: GoogleProfile = {
    id,
    emails: emailArray,
    name: {
      givenName,
      familyName,
    },
    photos: photosArray,
  };
  return result;
}
