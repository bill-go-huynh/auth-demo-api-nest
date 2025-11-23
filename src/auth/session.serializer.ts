import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { createError, DeserializeDone, isError, SerializeDone } from '@auth/types/passport.types';
import { extractUserPayload } from '@auth/types/type-helpers';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  override serializeUser(user: unknown, done: SerializeDone): void {
    try {
      const userPayload = extractUserPayload(user);
      done(null, userPayload);
    } catch (err) {
      const error: Error = isError(err) ? err : createError('Invalid user payload');
      done(error, null);
    }
  }

  override deserializeUser(payload: unknown, done: DeserializeDone): void {
    try {
      const userPayload = extractUserPayload(payload);
      done(null, userPayload);
    } catch (err) {
      const error: Error = isError(err) ? err : createError('Invalid payload');
      done(error, null);
    }
  }
}
