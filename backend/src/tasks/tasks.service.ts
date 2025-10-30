import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log(`Creating new task: ${createTaskDto.title}`, {
      operation: 'create',
      taskTitle: createTaskDto.title,
      priority: createTaskDto.priority,
    });
    
    const task = this.tasksRepository.create(createTaskDto);
    const savedTask = await this.tasksRepository.save(task);
    
    this.logger.log(`Task created successfully with ID: ${savedTask.id}`, {
      operation: 'create',
      taskId: savedTask.id,
      taskTitle: savedTask.title,
    });
    
    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    this.logger.log('Retrieving all tasks', { operation: 'findAll' });
    
    const tasks = await this.tasksRepository.find({
      order: { createdAt: 'DESC' },
    });
    
    this.logger.log(`Retrieved ${tasks.length} tasks`, {
      operation: 'findAll',
      taskCount: tasks.length,
    });
    
    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    this.logger.log(`Looking up task with ID: ${id}`, {
      operation: 'findOne',
      taskId: id,
    });
    
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      this.logger.warn(`Task not found with ID: ${id}`, {
        operation: 'findOne',
        taskId: id,
      });
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    this.logger.log(`Task found: ${task.title}`, {
      operation: 'findOne',
      taskId: task.id,
      taskTitle: task.title,
    });
    
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.log(`Updating task with ID: ${id}`, {
      operation: 'update',
      taskId: id,
      updateFields: Object.keys(updateTaskDto),
    });
    
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    const updatedTask = await this.tasksRepository.save(task);
    
    this.logger.log(`Task updated successfully: ${updatedTask.title}`, {
      operation: 'update',
      taskId: updatedTask.id,
      taskTitle: updatedTask.title,
    });
    
    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Deleting task with ID: ${id}`, {
      operation: 'remove',
      taskId: id,
    });
    
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
    
    this.logger.log(`Task deleted successfully: ${task.title}`, {
      operation: 'remove',
      taskId: id,
      taskTitle: task.title,
    });
  }

  // Intentional slow method for generating metrics
  async findSlowTasks(): Promise<Task[]> {
    this.logger.log('Starting slow task query (simulated delay)', {
      operation: 'findSlowTasks',
    });
    
    // Simulate slow database query
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tasks = await this.tasksRepository.find({
      where: { completed: false },
      order: { priority: 'DESC', createdAt: 'ASC' },
    });
    
    this.logger.log(`Slow task query completed, found ${tasks.length} incomplete tasks`, {
      operation: 'findSlowTasks',
      taskCount: tasks.length,
    });
    
    return tasks;
  }

  // Method that might fail for error rate metrics
  async findTasksWithRandomError(): Promise<Task[]> {
    this.logger.log('Attempting to find tasks with random error chance', {
      operation: 'findTasksWithRandomError',
    });
    
    // 30% chance of throwing an error to increase error rate
    if (Math.random() < 0.3) {
      this.logger.error('Random error triggered for testing error rates', {
        operation: 'findTasksWithRandomError',
        errorType: 'random_error',
      });
      throw new Error('Random database error for testing error rates');
    }
    
    const tasks = await this.tasksRepository.find();
    
    this.logger.log(`Random error query succeeded, found ${tasks.length} tasks`, {
      operation: 'findTasksWithRandomError',
      taskCount: tasks.length,
    });
    
    return tasks;
  }

  // Always error endpoint to purposely generate 500s on demand
  async alwaysError(): Promise<never> {
    this.logger.error('Intentional error triggered for testing alerts', {
      operation: 'alwaysError',
      errorType: 'intentional_error',
    });
    throw new Error('Intentional error for testing alerts');
  }
}
