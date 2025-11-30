import { AggregateRoot } from '../common/aggregate-root';
import { generateEventId } from '../common/id-generator';
import type { Category } from '../category/category';
import { TodoStatus } from './todo-status.vo';
import type {
  TodoCompletedEvent,
  TodoCreatedEvent,
  TodoDeletedEvent,
  TodoDomainEvent,
  TodoUpdatedEvent,
} from './todo.events';

export class Todo extends AggregateRoot<TodoDomainEvent> {
  private constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public title: string,
    public description: string | null,
    public dueDate: Date | null,
    public status: TodoStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public completedAt: Date | null,
    public isDeleted: boolean,
  ) {
    super();
  }

  static rehydrate(params: {
    id: string;
    categoryId: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    status: TodoStatus;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date | null;
    isDeleted: boolean;
  }): Todo {
    return new Todo(
      params.id,
      params.categoryId,
      params.title,
      params.description,
      params.dueDate,
      params.status,
      params.createdAt,
      params.updatedAt,
      params.completedAt,
      params.isDeleted,
    );
  }

  static createForCategory(params: {
    id: string;
    category: Category;
    title: string;
    description?: string | null;
    dueDate?: Date | null;
    now?: Date;
  }): Todo {
    const { id, category } = params;
    const now = params.now ?? new Date();

    if (category.isDeleted) {
      throw new Error('Cannot create todo in a deleted category');
    }

    const title = params.title.trim();
    if (!title) {
      throw new Error('Todo title is required');
    }
    if (title.length > 255) {
      throw new Error('Todo title must be at most 255 characters long');
    }

    const description = params.description?.trim() ?? null;
    const dueDate = params.dueDate ?? null;

    const todo = new Todo(
      id,
      category.id,
      title,
      description,
      dueDate,
      TodoStatus.Pending,
      now,
      now,
      null,
      false,
    );

    const event: TodoCreatedEvent = {
      id: generateEventId(),
      aggregateId: todo.id,
      aggregateType: 'Todo',
      eventType: 'TodoCreated',
      payload: {
        categoryId: todo.categoryId,
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        status: todo.status,
      },
      occurredAt: now,
    };

    todo.recordEvent(event as TodoDomainEvent);

    return todo;
  }

  update(params: {
    title?: string;
    description?: string | null;
    dueDate?: Date | null;
    status?: TodoStatus;
    now?: Date;
  }): void {
    if (this.isDeleted) {
      throw new Error('Cannot update a deleted todo');
    }

    const now = params.now ?? new Date();
    let changed = false;

    if (params.title !== undefined) {
      const title = params.title.trim();
      if (!title) {
        throw new Error('Todo title is required');
      }
      if (title.length > 255) {
        throw new Error('Todo title must be at most 255 characters long');
      }
      if (title !== this.title) {
        this.title = title;
        changed = true;
      }
    }

    if (params.description !== undefined) {
      const description = params.description?.trim() ?? null;
      if (description !== this.description) {
        this.description = description;
        changed = true;
      }
    }

    if (params.dueDate !== undefined) {
      const dueDate = params.dueDate ?? null;
      if ((dueDate?.getTime() ?? 0) !== (this.dueDate?.getTime() ?? 0)) {
        this.dueDate = dueDate;
        changed = true;
      }
    }

    if (params.status !== undefined && params.status !== this.status) {
      if (this.status === TodoStatus.Completed) {
        throw new Error(
          'Cannot change status of a completed todo; use complete()',
        );
      }
      this.status = params.status;
      changed = true;
    }

    if (!changed) {
      return;
    }

    this.updatedAt = now;

    const event: TodoUpdatedEvent = {
      id: generateEventId(),
      aggregateId: this.id,
      aggregateType: 'Todo',
      eventType: 'TodoUpdated',
      payload: {
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        status: this.status,
      },
      occurredAt: now,
    };

    this.recordEvent(event as TodoDomainEvent);
  }

  complete(now: Date = new Date()): void {
    if (this.isDeleted) {
      throw new Error('Cannot complete a deleted todo');
    }
    if (this.status === TodoStatus.Completed) {
      return;
    }

    this.status = TodoStatus.Completed;
    this.completedAt = now;
    this.updatedAt = now;

    const event: TodoCompletedEvent = {
      id: generateEventId(),
      aggregateId: this.id,
      aggregateType: 'Todo',
      eventType: 'TodoCompleted',
      payload: {
        completedAt: this.completedAt,
      },
      occurredAt: now,
    };

    this.recordEvent(event as TodoDomainEvent);
  }

  delete(now: Date = new Date(), reason: string | null = null): void {
    if (this.isDeleted) {
      return;
    }

    this.isDeleted = true;
    this.updatedAt = now;

    const event: TodoDeletedEvent = {
      id: generateEventId(),
      aggregateId: this.id,
      aggregateType: 'Todo',
      eventType: 'TodoDeleted',
      payload: {
        reason,
      },
      occurredAt: now,
    };

    this.recordEvent(event as TodoDomainEvent);
  }
}
