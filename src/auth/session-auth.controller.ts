import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { AuthService } from '@auth/auth.service';
import { LoginDto } from '@auth/dto/login.dto';
import { RegisterDto } from '@auth/dto/register.dto';
import { UserProfileResponseDto, UserResponseDto } from '@auth/dto/user-response.dto';
import { SessionAuthGuard } from '@auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '@auth/types/auth.types';
import type { GoogleOAuthRequest, SessionRequest } from '@auth/types/express.types';
import { UsersService } from '@users/users.service';

@ApiTags('auth-session')
@Controller('auth/session')
export class SessionAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.authService.register(registerDto);
    const result: UserResponseDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      googleId: user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return result;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, session created',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async getLogin(
    @Request() req: AuthenticatedRequest & SessionRequest,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    req.login({ id: user.id, email: user.email }, (err?: Error) => {
      if (err) {
        res.status(500).json({ message: 'Login failed' });
        return;
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          googleId: user.googleId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and destroy session' })
  @ApiCookieAuth('connect.sid')
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: {
        message: 'Logged out successfully',
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Logout failed' })
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
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiCookieAuth('connect.sid')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: AuthenticatedRequest): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        googleId: user.googleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google-session'))
  @ApiOperation({ summary: 'Initiate Google OAuth login (redirects to Google)' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  googleAuth(): void {
    // Passport automatically handles the OAuth flow and redirects to Google
    // No implementation needed - AuthGuard('google-session') triggers the strategy
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google-session'))
  @ApiOperation({ summary: 'Google OAuth callback (handled by Passport)' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend callback URL' })
  async googleAuthCallback(
    @Request() req: GoogleOAuthRequest & SessionRequest,
    @Res() res: Response,
  ): Promise<void> {
    const profile = req.user;
    const user = await this.authService.findOrCreateGoogleUser(profile);

    req.login({ id: user.id, email: user.email }, (err?: Error) => {
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
