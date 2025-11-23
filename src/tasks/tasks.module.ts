import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { SessionTasksController } from './session-tasks.controller';
import { JwtTasksController } from './jwt-tasks.controller';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [SessionTasksController, JwtTasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
