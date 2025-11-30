import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TodoUseCases } from '../application/todo/todo.use-cases';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const todos = app.get(TodoUseCases);
    const now = Date.now();
    const cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const deleted = await todos.deleteCompletedOlderThan(cutoff);
    // eslint-disable-next-line no-console
    console.log(`Deleted ${deleted} completed todos older than 30 days.`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to cleanup todos', err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void bootstrap();
