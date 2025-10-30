import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: Task })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log(`POST /tasks - Creating task: ${createTaskDto.title}`, {
      endpoint: 'POST /tasks',
      taskTitle: createTaskDto.title,
      priority: createTaskDto.priority,
    });
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [Task] })
  findAll(): Promise<Task[]> {
    this.logger.log('GET /tasks - Retrieving all tasks', {
      endpoint: 'GET /tasks',
    });
    return this.tasksService.findAll();
  }

  @Get('slow')
  @ApiOperation({ summary: 'Get slow tasks (intentionally slow for metrics)' })
  @ApiResponse({ status: 200, description: 'Slow tasks retrieved successfully', type: [Task] })
  findSlowTasks(): Promise<Task[]> {
    this.logger.log('GET /tasks/slow - Starting slow task query', {
      endpoint: 'GET /tasks/slow',
    });
    return this.tasksService.findSlowTasks();
  }

  @Get('error-prone')
  @ApiOperation({ summary: 'Get tasks with random errors (for error rate testing)' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [Task] })
  @ApiResponse({ status: 500, description: 'Random error occurred' })
  findTasksWithRandomError(): Promise<Task[]> {
    this.logger.log('GET /tasks/error-prone - Attempting query with random error chance', {
      endpoint: 'GET /tasks/error-prone',
    });
    return this.tasksService.findTasksWithRandomError();
  }

  @Get('error-always')
  @ApiOperation({ summary: 'Always return an error (force 500)' })
  @ApiResponse({ status: 500, description: 'Intentional error' })
  errorAlways(): Promise<never> {
    this.logger.log('GET /tasks/error-always - Triggering intentional error', {
      endpoint: 'GET /tasks/error-always',
    });
    return this.tasksService.alwaysError();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string): Promise<Task> {
    this.logger.log(`GET /tasks/${id} - Retrieving task by ID`, {
      endpoint: 'GET /tasks/:id',
      taskId: id,
    });
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.log(`PATCH /tasks/${id} - Updating task`, {
      endpoint: 'PATCH /tasks/:id',
      taskId: id,
      updateFields: Object.keys(updateTaskDto),
    });
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`DELETE /tasks/${id} - Deleting task`, {
      endpoint: 'DELETE /tasks/:id',
      taskId: id,
    });
    return this.tasksService.remove(+id);
  }
}
