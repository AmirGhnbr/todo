import { AggregateRoot } from '../common/aggregate-root';
import { generateEventId } from '../common/id-generator';
import { Email } from './email.vo';
import type {
  UserCreatedEvent,
  UserDeletedEvent,
  UserDomainEvent,
  UserUpdatedEvent,
} from './user.events';

export class User extends AggregateRoot<UserDomainEvent> {
  private constructor(
    public readonly id: string,
    public name: string,
    public email: Email,
    public passwordHash: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public isDeleted: boolean,
  ) {
    super();
  }

  static rehydrate(params: {
    id: string;
    name: string;
    email: Email;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
  }): User {
    return new User(
      params.id,
      params.name,
      params.email,
      params.passwordHash,
      params.createdAt,
      params.updatedAt,
      params.isDeleted,
    );
  }

  static create(params: {
    id: string;
    name: string;
    email: Email;
    passwordHash: string;
    now?: Date;
  }): User {
    const { id, email, passwordHash } = params;
    const now = params.now ?? new Date();

    const name = params.name.trim();
    if (!name) {
      throw new Error('User name is required');
    }
    if (name.length > 255) {
      throw new Error('User name must be at most 255 characters long');
    }
    if (!passwordHash.trim()) {
      throw new Error('Password hash is required');
    }

    const user = new User(id, name, email, passwordHash, now, now, false);

    const event: UserCreatedEvent = {
      id: generateEventId(),
      aggregateId: user.id,
      aggregateType: 'User',
      eventType: 'UserCreated',
      payload: {
        name: user.name,
        email: user.email.asString,
      },
      occurredAt: now,
    };

    user.recordEvent(event as UserDomainEvent);

    return user;
  }

  updateProfile(params: { name?: string; email?: Email; now?: Date }): void {
    if (this.isDeleted) {
      throw new Error('Cannot update a deleted user');
    }

    const now = params.now ?? new Date();
    let changed = false;

    if (params.name !== undefined) {
      const name = params.name.trim();
      if (!name) {
        throw new Error('User name is required');
      }
      if (name.length > 255) {
        throw new Error('User name must be at most 255 characters long');
      }
      if (name !== this.name) {
        this.name = name;
        changed = true;
      }
    }

    if (params.email !== undefined && !this.email.equals(params.email)) {
      this.email = params.email;
      changed = true;
    }

    if (!changed) {
      return;
    }

    this.updatedAt = now;

    const event: UserUpdatedEvent = {
      id: generateEventId(),
      aggregateId: this.id,
      aggregateType: 'User',
      eventType: 'UserUpdated',
      payload: {
        name: this.name,
        email: this.email.asString,
      },
      occurredAt: now,
    };

    this.recordEvent(event as UserDomainEvent);
  }

  delete(now: Date = new Date()): void {
    if (this.isDeleted) {
      return;
    }

    this.isDeleted = true;
    this.updatedAt = now;

    const event: UserDeletedEvent = {
      id: generateEventId(),
      aggregateId: this.id,
      aggregateType: 'User',
      eventType: 'UserDeleted',
      payload: {},
      occurredAt: now,
    };

    this.recordEvent(event as UserDomainEvent);
  }
}
