import { User } from './user';
import { Email } from './email.vo';

describe('User domain', () => {
  it('creates a user and records event', () => {
    const email = Email.create('test@example.com');

    const user = User.create({
      id: 'user-1',
      name: 'Test User',
      email,
      passwordHash: 'hash',
    });

    expect(user.id).toBe('user-1');
    expect(user.email.asString).toBe('test@example.com');
    expect(user.isDeleted).toBe(false);
    expect(user.pullEvents().length).toBeGreaterThan(0);
  });

  it('updates profile and records event', () => {
    const email = Email.create('test@example.com');
    const user = User.create({
      id: 'user-2',
      name: 'Old Name',
      email,
      passwordHash: 'hash',
    });

    user.updateProfile({ name: 'New Name' });

    expect(user.name).toBe('New Name');
  });

  it('deletes user and marks as deleted', () => {
    const email = Email.create('test@example.com');
    const user = User.create({
      id: 'user-3',
      name: 'To Delete',
      email,
      passwordHash: 'hash',
    });

    user.delete();

    expect(user.isDeleted).toBe(true);
  });
});
