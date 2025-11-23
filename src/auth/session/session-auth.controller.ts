import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '../types/auth.types';
import { SessionRequest, GoogleOAuthRequest } from '../types/express.types';

interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

@Controller('auth/session')
export class SessionAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    const result = {
      id: user.id,
      email: user.email,
      name: user.name,
      googleId: user.googleId,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  getLogin(@Request() req: AuthenticatedRequest) {
    return { user: req.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: SessionRequest, @Res() res: Response): void {
    req.session.destroy((err?: Error) => {
      if (err) {
        res.status(500).json({ message: 'Logout failed' });
        return;
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  }

  @UseGuards(SessionAuthGuard)
  @Get('me')
  getProfile(@Request() req: AuthenticatedRequest) {
    return { user: req.user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google-session'))
  googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google-session'))
  async googleAuthCallback(
    @Request() req: GoogleOAuthRequest,
    @Res() res: Response,
  ): Promise<void> {
    const profile = req.user;
    const user = await this.authService.findOrCreateGoogleUser(profile);

    const sessionReq = req as unknown as SessionRequest;
    sessionReq.login({ id: user.id, email: user.email }, (err?: Error) => {
      if (err) {
        res.redirect(
          `${this.configService.get<string>('GOOGLE_SESSION_REDIRECT_URL')}?error=auth_failed`,
        );
        return;
      }
      res.redirect(this.configService.get<string>('GOOGLE_SESSION_REDIRECT_URL') || '/');
    });
  }
}
