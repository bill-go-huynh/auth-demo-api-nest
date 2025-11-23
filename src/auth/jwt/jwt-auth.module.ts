import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthController } from './jwt-auth.controller';
import { JwtAuthService } from './jwt-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleJwtStrategy } from './strategies/google-jwt.strategy';
import { LocalJwtStrategy } from './strategies/local-jwt.strategy';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../auth.module';

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
    AuthModule,
  ],
  controllers: [JwtAuthController],
  providers: [JwtAuthService, JwtStrategy, JwtRefreshStrategy, GoogleJwtStrategy, LocalJwtStrategy],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
