import type { DomainEvent } from './domain-event';

export abstract class AggregateRoot<TEvent extends DomainEvent = DomainEvent> {
  private readonly uncommittedEvents: TEvent[] = [];

  protected recordEvent(event: TEvent): void {
    this.uncommittedEvents.push(event);
  }

  public pullEvents(): TEvent[] {
    const events = [...this.uncommittedEvents];
    this.uncommittedEvents.length = 0;
    return events;
  }
}
