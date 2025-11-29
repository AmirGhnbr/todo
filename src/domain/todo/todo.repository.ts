import type { Todo } from './todo';

export interface ITodoRepository {
  findById(id: string): Promise<Todo | null>;
  findByCategoryId(categoryId: string): Promise<Todo[]>;
  findByUserId(userId: string): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  delete(id: string): Promise<void>;
}
