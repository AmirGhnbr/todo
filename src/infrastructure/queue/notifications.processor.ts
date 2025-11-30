import { Logger } from '@nestjs/common';
import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { NotificationUseCases } from '../../application/notification/notification.use-cases';

@Processor('notifications-queue')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly notifications: NotificationUseCases) {}

  @Process('todo-due-notification')
  async handleTodoDueNotification(job: any): Promise<void> {
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
  onActive(job: any): void {
    this.logger.debug(`Job ${job.id} (${job.name}) is active`);
  }

  @OnQueueCompleted()
  onCompleted(job: any): void {
    this.logger.debug(`Job ${job.id} (${job.name}) completed`);
  }

  @OnQueueFailed()
  onFailed(job: any, error: any): void {
    this.logger.error(`Job ${job?.id} (${job?.name}) failed: ${error?.message ?? error}`);
  }
}
