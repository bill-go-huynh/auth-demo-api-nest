import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Updated task title',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Updated task description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Task completion status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
