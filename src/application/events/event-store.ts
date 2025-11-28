import type { DomainEvent } from '../../domain/common/domain-event';

export interface EventStore {
  appendEvents(aggregateId: string, events: DomainEvent[]): Promise<void>;
  getEventsForAggregate(aggregateId: string): Promise<DomainEvent[]>;
}
