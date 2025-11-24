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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { AuthService } from '@auth/auth.service';
import { LoginDto } from '@auth/dto/login.dto';
import { RefreshDto } from '@auth/dto/refresh.dto';
import { RegisterDto } from '@auth/dto/register.dto';
import { TokenResponseDto } from '@auth/dto/token-response.dto';
import { UserProfileResponseDto, UserResponseDto } from '@auth/dto/user-response.dto';
import type { AuthenticatedRequest, GoogleUserProfile } from '@auth/types/auth.types';
import { UsersService } from '@users/users.service';

import { JwtAuthService } from './jwt-auth.service';

interface GoogleOAuthRequest extends Request {
  user: GoogleUserProfile;
}

@ApiTags('auth-jwt')
@Controller('auth/jwt')
export class JwtAuthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      googleId: user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @UseGuards(AuthGuard('local-jwt'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password, receive JWT tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access and refresh tokens',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Request() req: AuthenticatedRequest): TokenResponseDto {
    return this.jwtAuthService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshDto })
  @ApiResponse({
    status: 200,
    description: 'New access token generated',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  refresh(@Request() req: AuthenticatedRequest): TokenResponseDto {
    return this.jwtAuthService.refresh(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('JWT-auth')
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
  @UseGuards(AuthGuard('google-jwt'))
  @ApiOperation({ summary: 'Initiate Google OAuth login (redirects to Google)' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  googleAuth(): void {
    // Passport automatically handles the OAuth flow and redirects to Google
    // No implementation needed - AuthGuard('google-jwt') triggers the strategy
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google-jwt'))
  @ApiOperation({ summary: 'Google OAuth callback (handled by Passport)' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with tokens in query params' })
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
      this.configService.get<string>('GOOGLE_JWT_REDIRECT_URL') ||
        'http://localhost:3001/oauth/callback',
    );
    redirectUrl.searchParams.set('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
    }

    return res.redirect(redirectUrl.toString());
  }
}
