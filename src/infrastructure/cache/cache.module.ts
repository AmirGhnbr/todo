import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { AppCacheService } from './cache.service';
import {
  CategoryTodosCacheInterceptor,
  UserCategoriesCacheInterceptor,
  UserTodosCacheInterceptor,
} from './user-cache.interceptor';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('REDIS_HOST') ?? 'localhost';
        const port = parseInt(config.get<string>('REDIS_PORT') ?? '6379', 10);
        const db = parseInt(config.get<string>('REDIS_DB') ?? '0', 10);
        const password = config.get<string>('REDIS_PASSWORD') ?? undefined;
        const ttl = parseInt(config.get<string>('CACHE_TTL_SECONDS') ?? '60', 10);

        return {
          store: await redisStore({
            socket: { host, port },
            password,
            database: db,
          }),
          ttl,
        };
      },
    }),
  ],
  providers: [
    AppCacheService,
    UserCategoriesCacheInterceptor,
    UserTodosCacheInterceptor,
    CategoryTodosCacheInterceptor,
  ],
  exports: [
    AppCacheService,
    UserCategoriesCacheInterceptor,
    UserTodosCacheInterceptor,
    CategoryTodosCacheInterceptor,
  ],
})
export class AppCacheModule {}
