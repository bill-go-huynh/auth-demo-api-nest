import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { SessionRequest } from '../../types/express.types';
import { UserPayload } from '../../types/auth.types';

@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy, 'session') {
  validate(req: SessionRequest): UserPayload | null {
    return req.user || null;
  }
}
