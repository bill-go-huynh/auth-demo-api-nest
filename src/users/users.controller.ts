import { Controller, Get, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserResponseDto } from '@auth/dto/user-response.dto';
import { CompositeAuthGuard } from '@auth/guards/auth.guard';
import type { AuthenticatedRequest } from '@auth/types/auth.types';

import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(CompositeAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiCookieAuth('connect.sid')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMe(@Request() req: AuthenticatedRequest): Promise<UserResponseDto> {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      googleId: user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
