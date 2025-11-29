import { Module } from '@nestjs/common';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { USER_REPOSITORY, CATEGORY_REPOSITORY, TODO_REPOSITORY, EVENT_STORE } from './application/tokens';
import type { IUserRepository } from './domain/user/user.repository';
import type { ICategoryRepository } from './domain/category/category.repository';
import type { ITodoRepository } from './domain/todo/todo.repository';
import type { EventStore } from './application/events/event-store';
import { AuthUseCases } from './application/auth/auth.use-cases';
import { CategoryUseCases } from './application/category/category.use-cases';
import { TodoUseCases } from './application/todo/todo.use-cases';

@Module({
  imports: [PersistenceModule],
  providers: [
    {
      provide: AuthUseCases,
      useFactory: (users: IUserRepository, events: EventStore) =>
        new AuthUseCases(users, events),
      inject: [USER_REPOSITORY, EVENT_STORE],
    },
    {
      provide: CategoryUseCases,
      useFactory: (
        categories: ICategoryRepository,
        users: IUserRepository,
        events: EventStore,
      ) => new CategoryUseCases(categories, users, events),
      inject: [CATEGORY_REPOSITORY, USER_REPOSITORY, EVENT_STORE],
    },
    {
      provide: TodoUseCases,
      useFactory: (
        todos: ITodoRepository,
        categories: ICategoryRepository,
        events: EventStore,
      ) => new TodoUseCases(todos, categories, events),
      inject: [TODO_REPOSITORY, CATEGORY_REPOSITORY, EVENT_STORE],
    },
  ],
  exports: [AuthUseCases, CategoryUseCases, TodoUseCases],
})
export class ApplicationModule {}
