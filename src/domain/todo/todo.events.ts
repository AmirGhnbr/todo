import type { DomainEvent } from '../common/domain-event';
import type { TodoStatus } from './todo-status.vo';

export interface TodoCreatedPayload {
  categoryId: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  status: TodoStatus;
}

export interface TodoUpdatedPayload {
  title?: string;
  description?: string | null;
  dueDate?: Date | null;
  status?: TodoStatus;
}

export interface TodoCompletedPayload {
  completedAt: Date;
}

export interface TodoDeletedPayload {
  reason?: string | null;
}

export interface TodoCreatedEvent extends DomainEvent<TodoCreatedPayload> {
  readonly aggregateType: 'Todo';
  readonly eventType: 'TodoCreated';
}

export interface TodoUpdatedEvent extends DomainEvent<TodoUpdatedPayload> {
  readonly aggregateType: 'Todo';
  readonly eventType: 'TodoUpdated';
}

export interface TodoCompletedEvent extends DomainEvent<TodoCompletedPayload> {
  readonly aggregateType: 'Todo';
  readonly eventType: 'TodoCompleted';
}

export interface TodoDeletedEvent extends DomainEvent<TodoDeletedPayload> {
  readonly aggregateType: 'Todo';
  readonly eventType: 'TodoDeleted';
}

export type TodoDomainEvent =
  | TodoCreatedEvent
  | TodoUpdatedEvent
  | TodoCompletedEvent
  | TodoDeletedEvent;
