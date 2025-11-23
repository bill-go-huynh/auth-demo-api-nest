import { BadRequestException } from '@nestjs/common';

import { GoogleProfile, UserPayload } from './auth.types';

export function extractUserPayload(value: unknown): UserPayload {
  if (typeof value !== 'object' || value === null) {
    throw new BadRequestException('Invalid user payload');
  }
  const obj = value as Record<string, unknown>;
  const id = obj.id;
  const email = obj.email;
  if (
    typeof id !== 'string' ||
    typeof email !== 'string' ||
    id.length === 0 ||
    email.length === 0
  ) {
    throw new BadRequestException('Invalid user payload');
  }
  const result: UserPayload = { id, email };
  return result;
}

export function extractGoogleProfile(value: unknown): GoogleProfile {
  if (typeof value !== 'object' || value === null) {
    throw new BadRequestException('Invalid Google profile');
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
    throw new BadRequestException('Invalid Google profile');
  }

  const nameObj = name as Record<string, unknown>;
  const givenName = nameObj.givenName;
  const familyName = nameObj.familyName;

  if (typeof givenName !== 'string' || typeof familyName !== 'string') {
    throw new BadRequestException('Invalid Google profile');
  }

  const emailArray: Array<{ value: string }> = emails as Array<{ value: string }>;
  const firstEmail = emailArray[0]?.value;
  if (!firstEmail) {
    throw new BadRequestException('Email not found in Google profile');
  }

  const result: GoogleProfile = {
    id,
    email: firstEmail,
    name: {
      givenName,
      familyName,
    },
  };
  return result;
}
