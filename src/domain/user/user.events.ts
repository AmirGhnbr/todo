import type { DomainEvent } from '../common/domain-event';

export interface UserCreatedPayload {
  name: string;
  email: string;
}

export interface UserUpdatedPayload {
  name: string;
  email: string;
}

export interface UserDeletedPayload {}

export interface UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  readonly aggregateType: 'User';
  readonly eventType: 'UserCreated';
}

export interface UserUpdatedEvent extends DomainEvent<UserUpdatedPayload> {
  readonly aggregateType: 'User';
  readonly eventType: 'UserUpdated';
}

export interface UserDeletedEvent extends DomainEvent<UserDeletedPayload> {
  readonly aggregateType: 'User';
  readonly eventType: 'UserDeleted';
}

export type UserDomainEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserDeletedEvent;
