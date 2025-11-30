import { randomUUID } from 'node:crypto';
import { Todo } from '../../domain/todo/todo';
import { TodoStatus } from '../../domain/todo/todo-status.vo';
import type { ITodoRepository } from '../../domain/todo/todo.repository';
import type { ICategoryRepository } from '../../domain/category/category.repository';
import type { EventStore } from '../events/event-store';

export class TodoUseCases {
  constructor(
    private readonly todos: ITodoRepository,
    private readonly categories: ICategoryRepository,
    private readonly events: EventStore,
  ) {}

  async create(
    userId: string,
    input: {
      categoryId: string;
      title: string;
      description?: string | null;
      dueDate?: Date | null;
    },
  ) {
    const category = await this.categories.findById(input.categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      throw new Error('Category not found');
    }

    const now = new Date();
    const todo = Todo.createForCategory({
      id: randomUUID(),
      category,
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      now,
    });

    await this.todos.save(todo);
    const events = todo.pullEvents();
    if (events.length) {
      await this.events.appendEvents(todo.id, events);
    }

    return todo;
  }

  async update(
    userId: string,
    todoId: string,
    input: {
      title?: string;
      description?: string | null;
      dueDate?: Date | null;
      status?: TodoStatus;
    },
  ) {
    const todo = await this.todos.findById(todoId);
    if (!todo || todo.isDeleted) {
      return null;
    }

    const category = await this.categories.findById(todo.categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      return null;
    }

    todo.update({
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      status: input.status,
    });

    await this.todos.save(todo);
    const events = todo.pullEvents();
    if (events.length) {
      await this.events.appendEvents(todo.id, events);
    }

    return todo;
  }

  async complete(userId: string, todoId: string) {
    const todo = await this.todos.findById(todoId);
    if (!todo || todo.isDeleted) {
      return null;
    }

    const category = await this.categories.findById(todo.categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      return null;
    }

    todo.complete();
    await this.todos.save(todo);
    const events = todo.pullEvents();
    if (events.length) {
      await this.events.appendEvents(todo.id, events);
    }

    return todo;
  }

  async delete(userId: string, todoId: string) {
    const todo = await this.todos.findById(todoId);
    if (!todo || todo.isDeleted) {
      return false;
    }

    const category = await this.categories.findById(todo.categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      return false;
    }

    todo.delete();
    await this.todos.save(todo);
    const events = todo.pullEvents();
    if (events.length) {
      await this.events.appendEvents(todo.id, events);
    }

    return true;
  }

  async getById(userId: string, todoId: string) {
    const todo = await this.todos.findById(todoId);
    if (!todo || todo.isDeleted) {
      return null;
    }

    const category = await this.categories.findById(todo.categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      return null;
    }

    return todo;
  }

  async listForUser(userId: string) {
    const todos = await this.todos.findByUserId(userId);
    return todos.filter((t) => !t.isDeleted);
  }

  async listForCategory(userId: string, categoryId: string) {
    const category = await this.categories.findById(categoryId);
    if (!category || category.userId !== userId || category.isDeleted) {
      return [];
    }

    const todos = await this.todos.findByCategoryId(categoryId);
    return todos.filter((t) => !t.isDeleted);
  }

  async deleteCompletedOlderThan(cutoff: Date): Promise<number> {
    const todos = await this.todos.findCompletedBefore(cutoff);
    let deletedCount = 0;

    for (const todo of todos) {
      if (todo.isDeleted) {
        continue;
      }

      todo.delete();
      await this.todos.save(todo);
      const events = todo.pullEvents();
      if (events.length) {
        await this.events.appendEvents(todo.id, events);
      }
      deletedCount += 1;
    }

    return deletedCount;
  }
}
