import { AggregateRoot } from '../common/aggregate-root';
import { generateEventId } from '../common/id-generator';
import type { User } from '../user/user';
import type {
  CategoryCreatedEvent,
  CategoryDeletedEvent,
  CategoryDomainEvent,
  CategoryUpdatedEvent,
} from './category.events';

export class Category extends AggregateRoot<CategoryDomainEvent> {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public description: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public isDeleted: boolean,
  ) {
    super();
  }

  static createForUser(params: {
    id: string;
    user: User;
    name: string;
    description?: string | null;
    now?: Date;
  }): Category {
    const { id, user, description } = params;
    const now = params.now ?? new Date();

    if (user.isDeleted) {
      throw new Error('Cannot create category for a deleted user');
    }

    const name = params.name.trim();
    if (!name) {
      throw new Error('Category name is required');
    }
    if (name.length > 100) {
      throw new Error('Category name must be at most 100 characters long');
    }

    const category = new Category(
      id,
      user.id,
      name,
      description?.trim() ?? null,
      now,
      now,
      false,
    );

    const event: CategoryCreatedEvent = {
      id: generateEventId(),
      aggregateId: category.id,
      aggregateType: 'Category',
      eventType: 'CategoryCreated',
      payload: {
        userId: category.userId,
        name: category.name,
        description: category.description,
      },
      occurredAt: now,
    };

    category['recordEvent'](event as CategoryDomainEvent);

    return category;
  }

  update(params: { name?: string; description?: string | null; now?: Date }): void {
    if (this.isDeleted) {
      throw new Error('Cannot update a deleted category');
    }

    const now = params.now ?? new Date();
    let changed = false;

    if (params.name !== undefined) {
      const name = params.name.trim();
      if (!name) {
        throw new Error('Category name is required');
      }
      if (name.length > 100) {
        throw new Error('Category name must be at most 100 characters long');
      }
      if (name !== this.name) {
        this.name = name;
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

    if (!changed) {
      return;
    }

    this.updatedAt = now;

    const event: CategoryUpdatedEvent = {
      id: generateEventId(),
      aggregateId: this.id,
      aggregateType: 'Category',
      eventType: 'CategoryUpdated',
      payload: {
        name: this.name,
        description: this.description,
      },
      occurredAt: now,
    };

    this['recordEvent'](event as CategoryDomainEvent);
  }

  delete(now: Date = new Date()): void {
    if (this.isDeleted) {
      return;
    }

    this.isDeleted = true;
    this.updatedAt = now;

    const event: CategoryDeletedEvent = {
      id: generateEventId(),
      aggregateId: this.id,
      aggregateType: 'Category',
      eventType: 'CategoryDeleted',
      payload: {
        isDeleted: this.isDeleted,
      },
      occurredAt: now,
    };

    this['recordEvent'](event as CategoryDomainEvent);
  }
}
