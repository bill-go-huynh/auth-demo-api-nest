import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { GoogleUserProfile } from '@auth/types/auth.types';
import { createError, isError } from '@auth/types/passport.types';
import { extractGoogleProfile } from '@auth/types/type-helpers';

@Injectable()
export abstract class BaseGoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService,
    strategyName: string,
    callbackURL: string,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!clientID || !clientSecret) {
      throw new InternalServerErrorException(
        'Google OAuth credentials are not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
      );
    }

    super(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ['email', 'profile'],
      },
      strategyName,
    );
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: VerifyCallback,
  ): void {
    try {
      const validatedProfile = extractGoogleProfile(profile);
      const nameObj = validatedProfile.name;
      const givenName = nameObj.givenName;
      const familyName = nameObj.familyName;

      const user: GoogleUserProfile = {
        googleId: validatedProfile.id,
        email: validatedProfile.email,
        name: `${givenName} ${familyName}`,
      };
      done(null, user);
    } catch (err) {
      const error: Error = isError(err) ? err : createError('Invalid Google profile');
      done(error, false);
    }
  }
}
