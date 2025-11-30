import { Category } from './category';
import type { User } from '../user/user';

describe('Category domain', () => {
  const user: User = {
    id: 'user-1',
    name: 'User',
    email: { asString: 'test@example.com' } as any,
    passwordHash: 'hash',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    updateProfile: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    delete: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    pullEvents: () => [],
  } as unknown as User;

  it('creates a category for user and records event', () => {
    const category = Category.createForUser({
      id: 'cat-1',
      user,
      name: 'Work',
    });

    expect(category.id).toBe('cat-1');
    expect(category.userId).toBe('user-1');
    expect(category.isDeleted).toBe(false);
    expect(category.pullEvents().length).toBeGreaterThan(0);
  });

  it('updates category name and description', () => {
    const category = Category.createForUser({ id: 'cat-2', user, name: 'Old', description: 'Old desc' });

    category.update({ name: 'New', description: 'New desc' });

    expect(category.name).toBe('New');
    expect(category.description).toBe('New desc');
  });

  it('deletes category and marks as deleted', () => {
    const category = Category.createForUser({ id: 'cat-3', user, name: 'To delete' });

    category.delete();

    expect(category.isDeleted).toBe(true);
  });
});
