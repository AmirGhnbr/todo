import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AppCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async invalidateUserCategories(userId: string): Promise<void> {
    await this.cache.del(this.keyForUserCategories(userId));
  }

  async invalidateUserTodos(userId: string): Promise<void> {
    await this.cache.del(this.keyForUserTodos(userId));
  }

  async invalidateCategoryTodos(
    userId: string,
    categoryId: string,
  ): Promise<void> {
    await this.cache.del(this.keyForCategoryTodos(userId, categoryId));
  }

  keyForUserCategories(userId: string): string {
    return `user:${userId}:categories`;
  }

  keyForUserTodos(userId: string): string {
    return `user:${userId}:todos`;
  }

  keyForCategoryTodos(userId: string, categoryId: string): string {
    return `user:${userId}:category:${categoryId}:todos`;
  }
}
