# Architecture Overview

This project implements a **Domain-Driven Design (DDD)** architecture with **Hexagonal (Ports & Adapters)** patterns and **Event Sourcing** capabilities.

## Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  (Controllers, DTOs, Swagger, Guards, Interceptors)          │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│  (Use Cases, Application Services, Event Store Interface)    │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│  (Entities, Aggregates, Value Objects, Domain Events,        │
│   Repository Interfaces)                                     │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                       │
│  (TypeORM Repositories, Redis Cache, Bull Queues,            │
│   JWT Auth, Schedulers, Event Store Implementation)          │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── domain/                    # Domain Layer (Pure TypeScript)
│   ├── common/               # Shared domain primitives
│   │   ├── aggregate-root.ts
│   │   ├── domain-event.ts
│   │   └── id-generator.ts
│   ├── user/                 # User aggregate
│   │   ├── user.ts
│   │   ├── user.events.ts
│   │   ├── user.repository.ts
│   │   └── email.vo.ts
│   ├── category/             # Category aggregate
│   ├── todo/                 # Todo aggregate
│   └── notification/         # Notification aggregate
│
├── application/              # Application Layer
│   ├── auth/                # Auth use cases
│   ├── category/            # Category use cases
│   ├── todo/                # Todo use cases
│   ├── notification/        # Notification use cases
│   ├── events/              # Event store interface
│   └── tokens.ts            # DI tokens
│
├── infrastructure/           # Infrastructure Layer
│   ├── persistence/         # TypeORM entities & repositories
│   ├── cache/               # Redis cache module
│   ├── queue/               # Bull queue & processors
│   ├── scheduling/          # Cron schedulers
│   └── auth/                # JWT/Passport implementation
│
├── presentation/             # Presentation Layer
│   ├── controllers/         # REST controllers
│   ├── dto/                 # Data Transfer Objects
│   └── services/            # Presentation services
│
└── cli/                      # CLI commands
```

## Key Patterns

### Domain-Driven Design (DDD)

- **Aggregates**: User, Category, Todo, Notification
- **Value Objects**: Email, TodoStatus
- **Domain Events**: UserCreated, TodoCompleted, etc.
- **Repository Interfaces**: Defined in domain, implemented in infrastructure

### Event Sourcing

Domain events are:

1. Created by aggregates during state changes
2. Stored in the EventStore
3. Available for replay and auditing

```typescript
// Example: Todo aggregate records events
const todo = Todo.createForCategory({ ... });
const events = todo.pullEvents(); // [TodoCreatedEvent]
await eventStore.appendEvents(todo.id, events);
```

### Hexagonal Architecture

- **Ports**: Repository interfaces in domain layer
- **Adapters**: TypeORM implementations in infrastructure
- **Dependency Inversion**: Domain depends on abstractions, not implementations

## Infrastructure Components

### Database (PostgreSQL + TypeORM)

- Entities map to domain aggregates
- Repositories implement domain interfaces
- Automatic schema sync in development

### Caching (Redis)

- Per-user cache keys for isolation
- CacheInterceptors on read endpoints
- Automatic invalidation on writes

### Background Jobs (Bull + Redis)

- Notification scheduling (24h before todo due date)
- Retry with exponential backoff
- Job lifecycle logging

### Scheduler (@nestjs/schedule)

- Daily cleanup of old completed todos
- Cron-based execution

### Authentication (Passport + JWT)

- JWT tokens for stateless auth
- Guards protecting routes
- Password hashing with bcrypt

### Rate Limiting (@nestjs/throttler)

- Global rate limiting
- Configurable TTL and limit

## Data Flow Example

```
HTTP Request → Controller → UseCase → Domain Aggregate
                                           │
                                           ▼
                              Domain Events Created
                                           │
                                           ▼
              Repository ← UseCase ← Aggregate Updated
                  │
                  ▼
         Database + EventStore
```

## Testing Strategy

- **Unit Tests**: Domain logic, use cases
- **E2E Tests**: Full API flows with real database
- **Mocking**: Repository interfaces for isolated testing
