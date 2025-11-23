import { UserPayload } from './auth.types';

export interface SerializeDone {
  (err: Error | null, user: UserPayload): void;
}

export interface DeserializeDone {
  (err: Error | null, payload: UserPayload): void;
}

export function createError(message: string): Error {
  return new Error(message);
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}
