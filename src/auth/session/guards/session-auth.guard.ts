import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionRequest } from '../../types/express.types';

@Injectable()
export class SessionAuthGuard extends AuthGuard('session') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SessionRequest>();
    const isAuthenticated = request.isAuthenticated;
    if (isAuthenticated && typeof isAuthenticated === 'function' && isAuthenticated()) {
      return true;
    }
    return super.canActivate(context) as Promise<boolean>;
  }
}
