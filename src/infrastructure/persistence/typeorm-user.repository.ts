import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user/user';
import { Email } from '../../domain/user/email.vo';
import type { IUserRepository } from '../../domain/user/user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async save(user: User): Promise<void> {
    let row = await this.repo.findOne({ where: { id: user.id } });
    if (!row) {
      row = this.repo.create();
      row.id = user.id;
    }

    row.name = user.name;
    row.email = user.email.asString;
    row.passwordHash = user.passwordHash;
    row.createdAt = user.createdAt;
    row.updatedAt = user.updatedAt;
    row.isDeleted = user.isDeleted;

    await this.repo.save(row);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(row: UserEntity): User {
    return User.rehydrate({
      id: row.id,
      name: row.name,
      email: Email.create(row.email),
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isDeleted: row.isDeleted,
    });
  }
}
