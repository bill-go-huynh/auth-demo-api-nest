import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GoogleUserProfile } from '../types/auth.types';
import { extractGoogleProfile } from '../types/type-helpers';
import { createError, isError } from '../types/passport.types';

@Injectable()
export class GoogleSessionStrategy extends PassportStrategy(Strategy, 'google-session') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: '/auth/google/session/callback',
      scope: ['email', 'profile'],
    });
  }

  override validate(
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: VerifyCallback,
  ): void {
    try {
      const validatedProfile = extractGoogleProfile(profile);
      const firstEmail = validatedProfile.emails[0];
      const email = firstEmail?.value;
      if (!email) {
        const error: Error = createError('Email not found in Google profile');
        done(error, null);
        return;
      }

      const nameObj = validatedProfile.name;
      const givenName = nameObj.givenName;
      const familyName = nameObj.familyName;
      const photos = validatedProfile.photos;
      const firstPhoto = photos?.[0];
      const avatar = firstPhoto?.value;

      const user: GoogleUserProfile = {
        googleId: validatedProfile.id,
        email,
        name: `${givenName} ${familyName}`,
        avatar,
      };
      done(null, user);
    } catch (err) {
      const error: Error = isError(err) ? err : createError('Invalid Google profile');
      done(error, null);
    }
  }
}
