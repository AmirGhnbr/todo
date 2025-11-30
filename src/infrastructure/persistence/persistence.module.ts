import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  USER_REPOSITORY,
  CATEGORY_REPOSITORY,
  TODO_REPOSITORY,
  EVENT_STORE,
  NOTIFICATION_REPOSITORY,
} from '../../application/tokens';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { TodoEntity } from './todo.entity';
import { EventEntity } from './event.entity';
import { NotificationEntity } from './notification.entity';
import { TypeOrmUserRepository } from './typeorm-user.repository';
import { TypeOrmCategoryRepository } from './typeorm-category.repository';
import { TypeOrmTodoRepository } from './typeorm-todo.repository';
import { TypeOrmEventStore } from './typeorm-event-store';
import { TypeOrmNotificationRepository } from './typeorm-notification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CategoryEntity, TodoEntity, EventEntity, NotificationEntity]),
  ],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: CATEGORY_REPOSITORY, useClass: TypeOrmCategoryRepository },
    { provide: TODO_REPOSITORY, useClass: TypeOrmTodoRepository },
    { provide: EVENT_STORE, useClass: TypeOrmEventStore },
    { provide: NOTIFICATION_REPOSITORY, useClass: TypeOrmNotificationRepository },
  ],
  exports: [USER_REPOSITORY, CATEGORY_REPOSITORY, TODO_REPOSITORY, EVENT_STORE, NOTIFICATION_REPOSITORY],
})
export class PersistenceModule {}
