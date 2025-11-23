import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { JwtAccessStrategy } from '@auth/strategies/jwt/jwt-access.strategy';
import { JwtRefreshStrategy } from '@auth/strategies/jwt/jwt-refresh.strategy';
import { LocalJwtStrategy } from '@auth/strategies/local/local-jwt.strategy';
import { GoogleJwtStrategy } from '@auth/strategies/oauth/google-jwt.strategy';
import { UsersModule } from '@users/users.module';

import { JwtAuthController } from './jwt-auth.controller';
import { JwtAuthService } from './jwt-auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [JwtAuthController],
  providers: [
    JwtAuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    GoogleJwtStrategy,
    LocalJwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthService, JwtAuthGuard],
})
export class JwtAuthModule {}
