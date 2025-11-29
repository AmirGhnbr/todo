import { randomUUID } from 'node:crypto';
import { Category } from '../../domain/category/category';
import type { ICategoryRepository } from '../../domain/category/category.repository';
import type { IUserRepository } from '../../domain/user/user.repository';
import type { EventStore } from '../events/event-store';

export class CategoryUseCases {
  constructor(
    private readonly categories: ICategoryRepository,
    private readonly users: IUserRepository,
    private readonly events: EventStore,
  ) {}

  async create(userId: string, input: { name: string; description?: string | null }) {
    const user = await this.users.findById(userId);
    if (!user || user.isDeleted) {
      throw new Error('User not found');
    }

    const now = new Date();
    const category = Category.createForUser({
      id: randomUUID(),
      user,
      name: input.name,
      description: input.description ?? null,
      now,
    });

    await this.categories.save(category);
    const events = category.pullEvents();
    if (events.length) {
      await this.events.appendEvents(category.id, events);
    }

    return category;
  }

  async update(
    userId: string,
    categoryId: string,
    input: { name?: string; description?: string | null },
  ) {
    const category = await this.categories.findById(categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      return null;
    }

    category.update({ name: input.name, description: input.description ?? null });
    await this.categories.save(category);
    const events = category.pullEvents();
    if (events.length) {
      await this.events.appendEvents(category.id, events);
    }

    return category;
  }

  async delete(userId: string, categoryId: string) {
    const category = await this.categories.findById(categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      return false;
    }

    category.delete();
    await this.categories.save(category);
    const events = category.pullEvents();
    if (events.length) {
      await this.events.appendEvents(category.id, events);
    }

    return true;
  }

  async getById(userId: string, categoryId: string) {
    const category = await this.categories.findById(categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      return null;
    }
    return category;
  }

  async listForUser(userId: string) {
    const categories = await this.categories.findByUserId(userId);
    return categories.filter((c) => !c.isDeleted);
  }
}
