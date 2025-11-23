import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : null;

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOrCreateGoogleUser(profile: {
    id: string;
    emails: Array<{ value: string }>;
    displayName: string;
    photos?: Array<{ value: string }>;
  }): Promise<User> {
    const email = profile.emails[0]?.value;
    if (!email) {
      throw new Error('Email not found in Google profile');
    }

    let user = await this.findByGoogleId(profile.id);
    if (user) {
      return user;
    }

    user = await this.findByEmail(email);
    if (user) {
      user.googleId = profile.id;
      if (profile.photos?.[0]?.value) {
        user.avatar = profile.photos[0].value;
      }
      return this.userRepository.save(user);
    }

    return this.create({
      email,
      name: profile.displayName,
      googleId: profile.id,
      avatar: profile.photos?.[0]?.value || null,
      password: null,
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }
}
