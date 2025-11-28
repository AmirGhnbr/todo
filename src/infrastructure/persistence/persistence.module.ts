import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY, CATEGORY_REPOSITORY, TODO_REPOSITORY, EVENT_STORE } from '../../application/tokens';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { TodoEntity } from './todo.entity';
import { EventEntity } from './event.entity';
import { TypeOrmUserRepository } from './typeorm-user.repository';
import { TypeOrmCategoryRepository } from './typeorm-category.repository';
import { TypeOrmTodoRepository } from './typeorm-todo.repository';
import { TypeOrmEventStore } from './typeorm-event-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CategoryEntity, TodoEntity, EventEntity]),
  ],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: CATEGORY_REPOSITORY, useClass: TypeOrmCategoryRepository },
    { provide: TODO_REPOSITORY, useClass: TypeOrmTodoRepository },
    { provide: EVENT_STORE, useClass: TypeOrmEventStore },
  ],
  exports: [USER_REPOSITORY, CATEGORY_REPOSITORY, TODO_REPOSITORY, EVENT_STORE],
})
export class PersistenceModule {}
