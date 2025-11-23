import { ExecutionContext, Injectable, Logger } from '@nestjs/common';

import { SessionRequest } from '@auth/types/express.types';

import { JwtAuthGuard } from './jwt-auth.guard';
import { SessionAuthGuard } from './session-auth.guard';

@Injectable()
export class CompositeAuthGuard {
  private readonly logger = new Logger(CompositeAuthGuard.name);

  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly sessionAuthGuard: SessionAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SessionRequest>();

    // Check if JWT token exists in Authorization header
    const authHeader = request.headers.authorization;
    const hasJwtToken = authHeader && authHeader.startsWith('Bearer ');

    // If JWT token exists, try JWT authentication first
    if (hasJwtToken) {
      try {
        const jwtResult = await this.jwtAuthGuard.canActivate(context);
        if (jwtResult) {
          return true;
        }
      } catch (error) {
        // JWT failed, continue to check session
        this.logger.debug('JWT authentication failed, trying session authentication', error);
      }
    }

    // Try session authentication
    try {
      const sessionResult = await this.sessionAuthGuard.canActivate(context);
      if (sessionResult) {
        return true;
      }
    } catch (error) {
      // Session failed
      this.logger.debug('Session authentication failed', error);
    }

    return false;
  }
}
