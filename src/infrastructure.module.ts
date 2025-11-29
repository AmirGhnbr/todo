import { Module } from '@nestjs/common';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { AppCacheModule } from './infrastructure/cache/cache.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { AuthModule } from './infrastructure/auth/auth.module';

@Module({
  imports: [PersistenceModule, AppCacheModule, QueueModule, AuthModule],
})
export class InfrastructureModule {}
