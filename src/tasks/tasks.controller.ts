import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CompositeAuthGuard } from '@auth/guards/auth.guard';
import type { AuthenticatedRequest } from '@auth/types/auth.types';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(CompositeAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiCookieAuth('connect.sid')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(req.user.id, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks retrieved successfully',
    type: [TaskResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req: AuthenticatedRequest): Promise<TaskResponseDto[]> {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Task belongs to another user' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string): Promise<TaskResponseDto> {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Task belongs to another user' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(id, req.user.id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Task belongs to another user' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id, req.user.id);
  }
}
