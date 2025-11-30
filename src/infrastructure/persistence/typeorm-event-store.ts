import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { DomainEvent } from '../../domain/common/domain-event';
import type { EventStore } from '../../application/events/event-store';
import { EventEntity } from './event.entity';

@Injectable()
export class TypeOrmEventStore implements EventStore {
  constructor(
    @InjectRepository(EventEntity)
    private readonly events: Repository<EventEntity>,
  ) {}

  async appendEvents(
    aggregateId: string,
    events: DomainEvent[],
  ): Promise<void> {
    if (!events.length) return;

    const rows = events.map((event) => {
      const row = this.events.create();
      row.id = event.id;
      row.aggregateId = event.aggregateId;
      row.aggregateType = event.aggregateType;
      row.eventType = event.eventType;
      row.payload = event.payload;
      row.createdAt = event.occurredAt;
      return row;
    });

    await this.events.save(rows);
  }

  async getEventsForAggregate(aggregateId: string): Promise<DomainEvent[]> {
    const rows = await this.events.find({
      where: { aggregateId },
      order: { createdAt: 'ASC' },
    });

    return rows.map((row) => ({
      id: row.id,
      aggregateId: row.aggregateId,
      aggregateType: row.aggregateType,
      eventType: row.eventType,
      payload: row.payload,
      occurredAt: row.createdAt,
    }));
  }
}
