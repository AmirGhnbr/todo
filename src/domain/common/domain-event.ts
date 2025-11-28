export interface DomainEvent<TPayload = unknown> {
  readonly id: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly eventType: string;
  readonly payload: TPayload;
  readonly occurredAt: Date;
}
