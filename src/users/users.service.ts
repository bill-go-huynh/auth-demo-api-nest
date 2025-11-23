import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOrCreateGoogleUser(profile: {
    id: string;
    email: string;
    displayName: string;
  }): Promise<User> {
    if (!profile.id) {
      throw new BadRequestException('Google ID not found in profile');
    }
    if (!profile.email) {
      throw new BadRequestException('Email not found in Google profile');
    }
    if (!profile.displayName) {
      throw new BadRequestException('Display name not found in Google profile');
    }

    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);

      let user = await userRepository.findOne({
        where: { googleId: profile.id },
      });

      if (user) {
        return user;
      }

      user = await userRepository.findOne({
        where: { email: profile.email },
      });

      if (user) {
        if (user.googleId && user.googleId !== profile.id) {
          throw new ConflictException(
            'Email is already associated with a different Google account',
          );
        }
        user.googleId = profile.id;
        return userRepository.save(user);
      }

      const createUserData: CreateUserDto = {
        email: profile.email,
        name: profile.displayName,
        googleId: profile.id,
      };

      const newUser = userRepository.create(createUserData);
      return userRepository.save(newUser);
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }
}
