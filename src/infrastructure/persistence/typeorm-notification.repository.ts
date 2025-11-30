import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { INotificationRepository } from '../../domain/notification/notification.repository';
import { Notification } from '../../domain/notification/notification';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class TypeOrmNotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  async findById(id: string): Promise<Notification | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const rows = await this.repo.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async save(notification: Notification): Promise<void> {
    let row = await this.repo.findOne({ where: { id: notification.id } });
    if (!row) {
      row = this.repo.create();
      row.id = notification.id;
      row.createdAt = notification.createdAt;
    }

    row.userId = notification.userId;
    row.title = notification.title;
    row.message = notification.message;
    row.isRead = notification.isRead;
    row.readAt = notification.readAt;
    row.relatedTodoId = notification.relatedTodoId;

    await this.repo.save(row);
  }

  private toDomain(row: NotificationEntity): Notification {
    return Notification.rehydrate({
      id: row.id,
      userId: row.userId,
      title: row.title,
      message: row.message,
      isRead: row.isRead,
      createdAt: row.createdAt,
      readAt: row.readAt,
      relatedTodoId: row.relatedTodoId,
    });
  }
}
