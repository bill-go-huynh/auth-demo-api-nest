import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SessionAuthController } from './session-auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleSessionStrategy } from './strategies/google.strategy';
import { SessionStrategy } from './strategies/session.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { AuthModule } from '../auth.module';

@Module({
  imports: [PassportModule.register({ session: true }), AuthModule],
  controllers: [SessionAuthController],
  providers: [LocalStrategy, GoogleSessionStrategy, SessionStrategy, SessionSerializer],
})
export class SessionAuthModule {}
