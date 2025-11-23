import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'User password (minimum 6 characters, maximum 100 characters)',
    example: 'password123',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Google OAuth ID (for Google sign-in users)',
    example: '1234567890',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  googleId?: string;
}
