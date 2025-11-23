import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Task ID' })
  id: string;

  @ApiProperty({ example: 'Complete project documentation', description: 'Task title' })
  title: string;

  @ApiProperty({
    example: 'Write comprehensive documentation',
    description: 'Task description',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: false, description: 'Task completion status' })
  completed: boolean;

  @ApiProperty({ example: 'user-uuid', description: 'User ID who owns this task' })
  userId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update date' })
  updatedAt: Date;
}
