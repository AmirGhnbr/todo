import type { DomainEvent } from '../common/domain-event';

export interface CategoryCreatedPayload {
  userId: string;
  name: string;
  description?: string | null;
}

export interface CategoryUpdatedPayload {
  name?: string;
  description?: string | null;
}

export interface CategoryDeletedPayload {
  isDeleted: boolean;
}

export interface CategoryCreatedEvent
  extends DomainEvent<CategoryCreatedPayload> {
  readonly aggregateType: 'Category';
  readonly eventType: 'CategoryCreated';
}

export interface CategoryUpdatedEvent
  extends DomainEvent<CategoryUpdatedPayload> {
  readonly aggregateType: 'Category';
  readonly eventType: 'CategoryUpdated';
}

export interface CategoryDeletedEvent
  extends DomainEvent<CategoryDeletedPayload> {
  readonly aggregateType: 'Category';
  readonly eventType: 'CategoryDeleted';
}

export type CategoryDomainEvent =
  | CategoryCreatedEvent
  | CategoryUpdatedEvent
  | CategoryDeletedEvent;
