import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from './jwt-auth.service';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalJwtAuthGuard } from './guards/local-jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload, GoogleUserProfile } from '../types/auth.types';

interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

interface GoogleOAuthRequest extends Request {
  user: GoogleUserProfile;
}

@Controller('auth/jwt')
export class JwtAuthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalJwtAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: AuthenticatedRequest) {
    return this.jwtAuthService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@Request() req: AuthenticatedRequest) {
    return this.jwtAuthService.refresh(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: AuthenticatedRequest) {
    return { user: req.user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google-jwt'))
  googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google-jwt'))
  async googleAuthCallback(
    @Request() req: GoogleOAuthRequest,
    @Res() res: Response,
  ): Promise<void> {
    const profile = req.user;
    const user = await this.authService.findOrCreateGoogleUser(profile);
    const tokens = this.jwtAuthService.login({
      id: user.id,
      email: user.email,
    });

    const redirectUrl = new URL(
      this.configService.get<string>('GOOGLE_JWT_REDIRECT_URL') || 'http://localhost:3001',
    );
    redirectUrl.searchParams.set('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
    }

    return res.redirect(redirectUrl.toString());
  }
}
