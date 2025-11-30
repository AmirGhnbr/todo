import { TodoUseCases } from './todo.use-cases';
import type { ITodoRepository } from '../../domain/todo/todo.repository';
import type { ICategoryRepository } from '../../domain/category/category.repository';
import type { EventStore } from '../events/event-store';
import { Todo } from '../../domain/todo/todo';
import { TodoStatus } from '../../domain/todo/todo-status.vo';

describe('TodoUseCases', () => {
  it('deleteCompletedOlderThan deletes completed todos via domain behavior and event store', async () => {
    const cutoff = new Date('2024-01-31T00:00:00Z');

    const todo = Todo.rehydrate({
      id: 'todo-1',
      categoryId: 'cat-1',
      title: 'Old completed',
      description: null,
      dueDate: null,
      status: TodoStatus.Completed,
      createdAt: new Date('2023-12-01T00:00:00Z'),
      updatedAt: new Date('2023-12-15T00:00:00Z'),
      completedAt: new Date('2023-12-20T00:00:00Z'),
      isDeleted: false,
    });

    const todosRepo: jest.Mocked<ITodoRepository> = {
      findById: jest.fn(),
      findByCategoryId: jest.fn(),
      findByUserId: jest.fn(),
      findCompletedBefore: jest.fn().mockResolvedValue([todo]),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const categoriesRepo: jest.Mocked<ICategoryRepository> = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const events: jest.Mocked<EventStore> = {
      appendEvents: jest.fn(),
      getEventsForAggregate: jest.fn(),
    };

    const useCases = new TodoUseCases(todosRepo, categoriesRepo, events);

    const deleted = await useCases.deleteCompletedOlderThan(cutoff);

    expect(deleted).toBe(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(todosRepo.save).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(events.appendEvents).toHaveBeenCalledTimes(1);
  });
});
