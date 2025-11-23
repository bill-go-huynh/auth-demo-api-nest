import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt/guards/jwt-auth.guard';
import { UserPayload } from '../auth/types/auth.types';

interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

@Controller('jwt/tasks')
@UseGuards(JwtAuthGuard)
export class JwtTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.id, createTaskDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user.id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.remove(id, req.user.id);
  }
}
