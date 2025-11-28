import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../../domain/todo/todo';
import { TodoStatus } from '../../domain/todo/todo-status.vo';
import type { ITodoRepository } from '../../domain/todo/todo.repository';
import { TodoEntity } from './todo.entity';

@Injectable()
export class TypeOrmTodoRepository implements ITodoRepository {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly repo: Repository<TodoEntity>,
  ) {}

  async findById(id: string): Promise<Todo | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByCategoryId(categoryId: string): Promise<Todo[]> {
    const rows = await this.repo.find({ where: { categoryId } });
    return rows.map((row) => this.toDomain(row));
  }

  async save(todo: Todo): Promise<void> {
    let row = await this.repo.findOne({ where: { id: todo.id } });
    if (!row) {
      row = this.repo.create();
      row.id = todo.id;
    }

    row.categoryId = todo.categoryId;
    row.title = todo.title;
    row.description = todo.description;
    row.dueDate = todo.dueDate;
    row.status = todo.status;
    row.createdAt = todo.createdAt;
    row.updatedAt = todo.updatedAt;
    row.completedAt = todo.completedAt;
    row.isDeleted = todo.isDeleted;

    await this.repo.save(row);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(row: TodoEntity): Todo {
    return Todo.rehydrate({
      id: row.id,
      categoryId: row.categoryId,
      title: row.title,
      description: row.description,
      dueDate: row.dueDate,
      status: row.status as TodoStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      completedAt: row.completedAt,
      isDeleted: row.isDeleted,
    });
  }
}
