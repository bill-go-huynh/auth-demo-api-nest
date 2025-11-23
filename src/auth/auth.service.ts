import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserPayload, GoogleUserProfile } from './types/auth.types';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<UserPayload | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.validatePassword(user, password))) {
      return {
        id: user.id,
        email: user.email,
      };
    }
    return null;
  }

  async register(registerDto: CreateUserDto): Promise<User> {
    return this.usersService.create(registerDto);
  }

  async findOrCreateGoogleUser(profile: GoogleUserProfile): Promise<User> {
    return this.usersService.findOrCreateGoogleUser({
      id: profile.googleId,
      emails: [{ value: profile.email }],
      displayName: profile.name,
      photos: profile.avatar ? [{ value: profile.avatar }] : undefined,
    });
  }
}
