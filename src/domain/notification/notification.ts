export class Notification {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public message: string,
    public isRead: boolean,
    public readonly createdAt: Date,
    public readAt: Date | null,
    public readonly relatedTodoId: string | null,
  ) {}

  static rehydrate(params: {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    readAt: Date | null;
    relatedTodoId: string | null;
  }): Notification {
    return new Notification(
      params.id,
      params.userId,
      params.title,
      params.message,
      params.isRead,
      params.createdAt,
      params.readAt,
      params.relatedTodoId,
    );
  }

  static create(params: {
    id: string;
    userId: string;
    title: string;
    message: string;
    relatedTodoId?: string | null;
    now?: Date;
  }): Notification {
    const now = params.now ?? new Date();

    const title = params.title.trim();
    if (!title) {
      throw new Error('Notification title is required');
    }
    if (title.length > 255) {
      throw new Error('Notification title must be at most 255 characters long');
    }

    const message = params.message.trim();
    if (!message) {
      throw new Error('Notification message is required');
    }

    const relatedTodoId = params.relatedTodoId ?? null;

    return new Notification(
      params.id,
      params.userId,
      title,
      message,
      false,
      now,
      null,
      relatedTodoId,
    );
  }

  markAsRead(now: Date = new Date()): void {
    if (this.isRead) {
      return;
    }

    this.isRead = true;
    this.readAt = now;
  }
}
