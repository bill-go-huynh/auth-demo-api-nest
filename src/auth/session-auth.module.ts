import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from '@auth/auth.module';
import { SessionAuthGuard } from '@auth/guards/session-auth.guard';
import { LocalSessionStrategy } from '@auth/strategies/local/local-session.strategy';
import { GoogleSessionStrategy } from '@auth/strategies/oauth/google-session.strategy';
import { SessionStrategy } from '@auth/strategies/session/session.strategy';
import { UsersModule } from '@users/users.module';

import { SessionSerializer } from './session.serializer';
import { SessionAuthController } from './session-auth.controller';

@Module({
  imports: [PassportModule.register({ session: true }), forwardRef(() => AuthModule), UsersModule],
  controllers: [SessionAuthController],
  providers: [
    LocalSessionStrategy,
    GoogleSessionStrategy,
    SessionStrategy,
    SessionSerializer,
    SessionAuthGuard,
  ],
  exports: [SessionAuthGuard],
})
export class SessionAuthModule {}
