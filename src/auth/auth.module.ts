import { forwardRef, Module } from '@nestjs/common';

import { JwtAuthModule } from '@auth/jwt-auth.module';
import { SessionAuthModule } from '@auth/session-auth.module';
import { UsersModule } from '@users/users.module';

import { AuthService } from './auth.service';
import { CompositeAuthGuard } from './guards/auth.guard';

@Module({
  imports: [UsersModule, forwardRef(() => JwtAuthModule), forwardRef(() => SessionAuthModule)],
  providers: [AuthService, CompositeAuthGuard],
  exports: [AuthService, CompositeAuthGuard],
})
export class AuthModule {}
