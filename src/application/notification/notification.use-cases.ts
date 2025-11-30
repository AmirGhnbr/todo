import { randomUUID } from 'node:crypto';
import type { INotificationRepository } from '../../domain/notification/notification.repository';
import { Notification } from '../../domain/notification/notification';

export class NotificationUseCases {
  constructor(private readonly notifications: INotificationRepository) {}

  async createForUser(input: {
    userId: string;
    title: string;
    message: string;
    relatedTodoId?: string | null;
  }): Promise<Notification> {
    const notification = Notification.create({
      id: randomUUID(),
      userId: input.userId,
      title: input.title,
      message: input.message,
      relatedTodoId: input.relatedTodoId ?? null,
    });

    await this.notifications.save(notification);
    return notification;
  }

  async listUnreadForUser(userId: string): Promise<Notification[]> {
    return this.notifications.findUnreadByUserId(userId);
  }

  async markAsRead(userId: string, id: string): Promise<Notification | null> {
    const notification = await this.notifications.findById(id);
    if (!notification || notification.userId !== userId) {
      return null;
    }

    notification.markAsRead();
    await this.notifications.save(notification);
    return notification;
  }
}
