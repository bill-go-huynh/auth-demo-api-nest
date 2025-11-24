import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'passport-google-oauth20';

import { GoogleUserProfile } from '@auth/types/auth.types';
import { createError, isError } from '@auth/types/passport.types';
import { extractGoogleProfile } from '@auth/types/type-helpers';

export class GoogleStrategyHelper {
  static getStrategyOptions(
    configService: ConfigService,
    callbackURL: string,
  ): { clientID: string; clientSecret: string; callbackURL: string; scope: string[] } {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!clientID || !clientSecret) {
      throw new InternalServerErrorException(
        'Google OAuth credentials are not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
      );
    }

    return {
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    };
  }

  static validate(
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
