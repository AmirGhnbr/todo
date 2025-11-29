import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { TodoUseCases } from '../../application/todo/todo.use-cases';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { TodoResponseDto, CreateTodoDto, UpdateTodoDto } from '../dto/todo.dto';
import { TodoStatus } from '../../domain/todo/todo-status.vo';

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todos: TodoUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create todo' })
  @ApiResponse({ status: 201, type: TodoResponseDto })
  async create(@Req() req: Request, @Body() dto: CreateTodoDto): Promise<TodoResponseDto> {
    const userId = (req as any).user.userId as string;
    const todo = await this.todos.create(userId, {
      categoryId: dto.categoryId,
      title: dto.title,
      description: dto.description ?? null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });

    return this.toDto(todo);
  }

  @Get()
  @ApiOperation({ summary: 'List todos for current user' })
  @ApiResponse({ status: 200, type: [TodoResponseDto] })
  async list(@Req() req: Request): Promise<TodoResponseDto[]> {
    const userId = (req as any).user.userId as string;
    const todos = await this.todos.listForUser(userId);
    return todos.map((t) => this.toDto(t));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get todo by id' })
  @ApiResponse({ status: 200, type: TodoResponseDto })
  async getById(@Req() req: Request, @Param('id') id: string): Promise<TodoResponseDto | null> {
    const userId = (req as any).user.userId as string;
    const todo = await this.todos.getById(userId, id);
    return todo ? this.toDto(todo) : null;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo' })
  @ApiResponse({ status: 200, type: TodoResponseDto })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoResponseDto | null> {
    const userId = (req as any).user.userId as string;
    const todo = await this.todos.update(userId, id, {
      title: dto.title,
      description: dto.description ?? null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });

    return todo ? this.toDto(todo) : null;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete todo' })
  @ApiResponse({ status: 204 })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    const userId = (req as any).user.userId as string;
    await this.todos.delete(userId, id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark todo as completed' })
  @ApiResponse({ status: 200, type: TodoResponseDto })
  async complete(@Req() req: Request, @Param('id') id: string): Promise<TodoResponseDto | null> {
    const userId = (req as any).user.userId as string;
    const todo = await this.todos.complete(userId, id);
    return todo ? this.toDto(todo) : null;
  }

  private toDto(todo: any): TodoResponseDto {
    return {
      id: todo.id,
      categoryId: todo.categoryId,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
      status: todo.status,
    };
  }
}
