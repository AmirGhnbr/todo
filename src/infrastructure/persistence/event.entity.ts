import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'events' })
export class EventEntity {
  @PrimaryColumn({ length: 64 })
  id!: string;

  @Column({ name: 'aggregate_id', length: 64 })
  aggregateId!: string;

  @Column({ name: 'aggregate_type', length: 64 })
  aggregateType!: string;

  @Column({ name: 'event_type', length: 128 })
  eventType!: string;

  @Column({ type: 'jsonb' })
  payload!: unknown;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
