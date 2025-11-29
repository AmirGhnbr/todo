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
import { CategoryUseCases } from '../../application/category/category.use-cases';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { Category } from '../../domain/category/category';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { TodoResponseDto } from '../dto/todo.dto';
import { TodoUseCases } from '../../application/todo/todo.use-cases';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categories: CategoryUseCases,
    private readonly todos: TodoUseCases,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  async create(@Req() req: Request, @Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const userId = (req as any).user.userId as string;
    const category = await this.categories.create(userId, {
      name: dto.name,
      description: dto.description ?? null,
    });
    return this.toDto(category);
  }

  @Get()
  @ApiOperation({ summary: 'List categories for current user' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  async list(@Req() req: Request): Promise<CategoryResponseDto[]> {
    const userId = (req as any).user.userId as string;
    const categories = await this.categories.listForUser(userId);
    return categories.map((c) => this.toDto(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async getById(@Req() req: Request, @Param('id') id: string): Promise<CategoryResponseDto | null> {
    const userId = (req as any).user.userId as string;
    const category = await this.categories.getById(userId, id);
    return category ? this.toDto(category) : null;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto | null> {
    const userId = (req as any).user.userId as string;
    const category = await this.categories.update(userId, id, {
      name: dto.name,
      description: dto.description ?? null,
    });
    return category ? this.toDto(category) : null;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 204 })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    const userId = (req as any).user.userId as string;
    await this.categories.delete(userId, id);
  }

  @Get(':categoryId/todos')
  @ApiOperation({ summary: 'List todos for a category' })
  @ApiResponse({ status: 200, type: [TodoResponseDto] })
  async listTodos(
    @Req() req: Request,
    @Param('categoryId') categoryId: string,
  ): Promise<TodoResponseDto[]> {
    const userId = (req as any).user.userId as string;
    const todos = await this.todos.listForCategory(userId, categoryId);
    return todos.map((t) => ({
      id: t.id,
      categoryId: t.categoryId,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      status: t.status,
    }));
  }

  private toDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }
}
