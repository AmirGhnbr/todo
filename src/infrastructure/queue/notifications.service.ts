import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class NotificationsQueueService {
  private readonly logger = new Logger(NotificationsQueueService.name);

  constructor(
    @InjectQueue('notifications-queue')
    private readonly queue: Queue,
  ) {}

  async scheduleTodoDueNotification(
    todoId: string,
    userId: string,
    dueDate: Date | null,
  ): Promise<void> {
    const jobId = this.jobIdForTodo(todoId);

    // Remove any existing scheduled job for this todo
    await this.queue.removeJobs(jobId);

    if (!dueDate) {
      return;
    }

    const notifyAt = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
    let delay = notifyAt.getTime() - Date.now();
    if (delay < 0) {
      delay = 0;
    }

    await this.queue.add(
      'todo-due-notification',
      {
        todoId,
        userId,
        dueDate: dueDate.toISOString(),
        notifyAt: new Date(Date.now() + delay).toISOString(),
      },
      {
        jobId,
        delay,
      },
    );

    this.logger.debug(
      `Scheduled notification for todo ${todoId} in ${delay}ms`,
    );
  }

  async cancelTodoDueNotification(todoId: string): Promise<void> {
    const jobId = this.jobIdForTodo(todoId);
    await this.queue.removeJobs(jobId);
  }

  private jobIdForTodo(todoId: string): string {
    return `todo:${todoId}:due`;
  }
}
