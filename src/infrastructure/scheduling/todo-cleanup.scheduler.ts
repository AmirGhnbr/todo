import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TodoUseCases } from '../../application/todo/todo.use-cases';

@Injectable()
export class TodoCleanupScheduler {
  private readonly logger = new Logger(TodoCleanupScheduler.name);

  constructor(private readonly todos: TodoUseCases) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanupOldCompletedTodos(): Promise<void> {
    const now = Date.now();
    const cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const deleted = await this.todos.deleteCompletedOlderThan(cutoff);
    if (deleted > 0) {
      this.logger.log(
        `Cleaned up ${deleted} completed todos older than 30 days`,
      );
    }
  }
}
