import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationModule } from '../../application.module';
import { TodoCleanupScheduler } from './todo-cleanup.scheduler';

@Module({
  imports: [ScheduleModule.forRoot(), ApplicationModule],
  providers: [TodoCleanupScheduler],
})
export class SchedulingModule {}
