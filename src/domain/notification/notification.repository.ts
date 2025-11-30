import type { Notification } from './notification';

export interface INotificationRepository {
  findById(id: string): Promise<Notification | null>;
  findUnreadByUserId(userId: string): Promise<Notification[]>;
  save(notification: Notification): Promise<void>;
}
