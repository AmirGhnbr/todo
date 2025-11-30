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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email?: string;
  };
}
import { CategoryUseCases } from '../../application/category/category.use-cases';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { Category } from '../../domain/category/category';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dto/category.dto';
import { TodoResponseDto } from '../dto/todo.dto';
import { TodoUseCases } from '../../application/todo/todo.use-cases';
import { AppCacheService } from '../../infrastructure/cache/cache.service';
import {
  CategoryTodosCacheInterceptor,
  UserCategoriesCacheInterceptor,
} from '../../infrastructure/cache/user-cache.interceptor';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categories: CategoryUseCases,
    private readonly todos: TodoUseCases,
    private readonly cache: AppCacheService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const userId = req.user.userId;
    const category = await this.categories.create(userId, {
      name: dto.name,
      description: dto.description ?? null,
    });
    await this.cache.invalidateUserCategories(userId);
    return this.toDto(category);
  }

  @Get()
  @ApiOperation({ summary: 'List categories for current user' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  @UseInterceptors(UserCategoriesCacheInterceptor)
  async list(@Req() req: AuthenticatedRequest): Promise<CategoryResponseDto[]> {
    const userId = req.user.userId;
    const categories = await this.categories.listForUser(userId);
    return categories.map((c) => this.toDto(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async getById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto | null> {
    const userId = req.user.userId;
    const category = await this.categories.getById(userId, id);
    return category ? this.toDto(category) : null;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto | null> {
    const userId = req.user.userId;
    const category = await this.categories.update(userId, id, {
      name: dto.name,
      description: dto.description ?? null,
    });
    if (category) {
      await this.cache.invalidateUserCategories(userId);
      return this.toDto(category);
    }
    return null;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 204 })
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = req.user.userId;
    const deleted = await this.categories.delete(userId, id);
    if (deleted) {
      await this.cache.invalidateUserCategories(userId);
      await this.cache.invalidateUserTodos(userId);
      await this.cache.invalidateCategoryTodos(userId, id);
    }
  }

  @Get(':categoryId/todos')
  @ApiOperation({ summary: 'List todos for a category' })
  @ApiResponse({ status: 200, type: [TodoResponseDto] })
  @UseInterceptors(CategoryTodosCacheInterceptor)
  async listTodos(
    @Req() req: AuthenticatedRequest,
    @Param('categoryId') categoryId: string,
  ): Promise<TodoResponseDto[]> {
    const userId = req.user.userId;
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
