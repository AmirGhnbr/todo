import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/category/category';
import type { ICategoryRepository } from '../../domain/category/category.repository';
import { CategoryEntity } from './category.entity';

@Injectable()
export class TypeOrmCategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async findById(id: string): Promise<Category | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<Category[]> {
    const rows = await this.repo.find({ where: { userId } });
    return rows.map((row) => this.toDomain(row));
  }

  async save(category: Category): Promise<void> {
    let row = await this.repo.findOne({ where: { id: category.id } });
    if (!row) {
      row = this.repo.create();
      row.id = category.id;
    }

    row.userId = category.userId;
    row.name = category.name;
    row.description = category.description;
    row.createdAt = category.createdAt;
    row.updatedAt = category.updatedAt;
    row.isDeleted = category.isDeleted;

    await this.repo.save(row);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(row: CategoryEntity): Category {
    return Category.rehydrate({
      id: row.id,
      userId: row.userId,
      name: row.name,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isDeleted: row.isDeleted,
    });
  }
}
