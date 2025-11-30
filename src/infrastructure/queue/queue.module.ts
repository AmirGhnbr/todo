import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsQueueService } from './notifications.service';
import { ApplicationModule } from '../../application.module';

@Module({
  imports: [
    ConfigModule,
    ApplicationModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST') ?? 'localhost',
          port: parseInt(config.get<string>('REDIS_PORT') ?? '6379', 10),
          password: config.get<string>('REDIS_PASSWORD') ?? undefined,
          db: parseInt(config.get<string>('REDIS_DB') ?? '0', 10),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'notifications-queue',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 30000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  providers: [NotificationsProcessor, NotificationsQueueService],
  exports: [NotificationsQueueService],
})
export class QueueModule {}
