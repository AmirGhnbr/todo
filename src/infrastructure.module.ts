import { Module } from '@nestjs/common';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { AppCacheModule } from './infrastructure/cache/cache.module';
import { QueueModule } from './infrastructure/queue/queue.module';

// ARCHITECTURE NOTE:
// This module groups infrastructure adapters (database, cache, queues, external services).
// It may depend on NestJS and external libraries, but must only expose ports to the
// application/domain layers via interfaces.
@Module({
  imports: [PersistenceModule, AppCacheModule, QueueModule],
})
export class InfrastructureModule {}
