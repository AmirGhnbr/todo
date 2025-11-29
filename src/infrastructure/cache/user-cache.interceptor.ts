import { Inject, Injectable, ExecutionContext } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AppCacheService } from './cache.service';

@Injectable()
export class UserCategoriesCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector,
    private readonly cacheKeys: AppCacheService,
  ) {
    super(cacheManager, reflector);
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = (request as any).user?.userId as string | undefined;
    if (!userId) {
      return undefined;
    }

    return this.cacheKeys.keyForUserCategories(userId);
  }
}

@Injectable()
export class UserTodosCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector,
    private readonly cacheKeys: AppCacheService,
  ) {
    super(cacheManager, reflector);
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = (request as any).user?.userId as string | undefined;
    if (!userId) {
      return undefined;
    }

    return this.cacheKeys.keyForUserTodos(userId);
  }
}

@Injectable()
export class CategoryTodosCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector,
    private readonly cacheKeys: AppCacheService,
  ) {
    super(cacheManager, reflector);
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = (request as any).user?.userId as string | undefined;
    const categoryId = request.params?.categoryId as string | undefined;

    if (!userId || !categoryId) {
      return undefined;
    }

    return this.cacheKeys.keyForCategoryTodos(userId, categoryId);
  }
}
