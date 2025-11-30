import { Notification } from './notification';

describe('Notification domain', () => {
  it('creates a notification with required fields', () => {
    const now = new Date();
    const notification = Notification.create({
      id: 'notif-1',
      userId: 'user-1',
      title: 'Title',
      message: 'Message',
      now,
    });

    expect(notification.id).toBe('notif-1');
    expect(notification.userId).toBe('user-1');
    expect(notification.title).toBe('Title');
    expect(notification.message).toBe('Message');
    expect(notification.isRead).toBe(false);
    expect(notification.createdAt).toBe(now);
    expect(notification.readAt).toBeNull();
  });

  it('marks notification as read', () => {
    const notification = Notification.create({
      id: 'notif-2',
      userId: 'user-1',
      title: 'Title',
      message: 'Message',
    });

    notification.markAsRead();

    expect(notification.isRead).toBe(true);
    expect(notification.readAt).toBeInstanceOf(Date);
  });
});
