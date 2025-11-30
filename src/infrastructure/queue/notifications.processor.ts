import { Logger } from '@nestjs/common';
import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationUseCases } from '../../application/notification/notification.use-cases';

interface TodoDueNotificationJobData {
  todoId: string;
  userId: string;
  dueDate?: string;
  notifyAt?: string;
}

interface TodoDueNotificationJob extends Job {
  data: TodoDueNotificationJobData;
}

interface BullJob {
  id?: string | number;
  name?: string;
}

@Processor('notifications-queue')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly notifications: NotificationUseCases) {}

  @Process('todo-due-notification')
  async handleTodoDueNotification(job: TodoDueNotificationJob): Promise<void> {
    const { todoId, userId, dueDate, notifyAt } = job.data ?? {};

    if (!userId || !todoId) {
      this.logger.warn('Received todo-due-notification job without userId or todoId');
      return;
    }

    await this.notifications.createForUser({
      userId,
      title: 'Todo due soon',
      message: `Your todo ${todoId} is due at ${dueDate}.`,
      relatedTodoId: todoId,
    });

    this.logger.log(
      `Created notification for user ${userId} about todo ${todoId} (dueDate=${dueDate}, notifyAt=${notifyAt})`,
    );
  }

  @OnQueueActive()
  onActive(job: BullJob): void {
    this.logger.debug(`Job ${job.id} (${job.name}) is active`);
  }

  @OnQueueCompleted()
  onCompleted(job: BullJob): void {
    this.logger.debug(`Job ${job.id} (${job.name}) completed`);
  }

  @OnQueueFailed()
  onFailed(job: BullJob, error: Error): void {
    this.logger.error(`Job ${job?.id} (${job?.name}) failed: ${error?.message ?? error}`);
  }
}
