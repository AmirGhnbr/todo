import { Todo } from './todo';
import { TodoStatus } from './todo-status.vo';
import type { Category } from '../category/category';

describe('Todo domain', () => {
  const category: Category = {
    // minimal shape needed for tests
    id: 'cat-1',
    userId: 'user-1',
    name: 'Work',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    delete: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    pullEvents: () => [],
  } as unknown as Category;

  it('creates a todo for category and records event', () => {
    const todo = Todo.createForCategory({
      id: 'todo-1',
      category,
      title: 'Test todo',
      description: 'Desc',
    });

    expect(todo.id).toBe('todo-1');
    expect(todo.categoryId).toBe('cat-1');
    expect(todo.status).toBe(TodoStatus.Pending);
    expect(todo.isDeleted).toBe(false);
    expect(todo.pullEvents().length).toBeGreaterThan(0);
  });

  it('updates fields and records update event', () => {
    const todo = Todo.createForCategory({ id: 'todo-2', category, title: 'Old title' });

    todo.update({ title: 'New title', description: 'New desc' });

    expect(todo.title).toBe('New title');
    expect(todo.description).toBe('New desc');
  });

  it('completes a todo and records completedAt', () => {
    const todo = Todo.createForCategory({ id: 'todo-3', category, title: 'Complete me' });

    todo.complete();

    expect(todo.status).toBe(TodoStatus.Completed);
    expect(todo.completedAt).toBeInstanceOf(Date);
  });

  it('deletes a todo and marks as deleted', () => {
    const todo = Todo.createForCategory({ id: 'todo-4', category, title: 'Delete me' });

    todo.delete();

    expect(todo.isDeleted).toBe(true);
  });
});
