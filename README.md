# Todo Service API

A scalable, production-ready Todo list backend built with **NestJS**, featuring **Domain-Driven Design (DDD)**, **Hexagonal Architecture**, **Event Sourcing**, **Redis caching**, **Bull queues**, **JWT authentication**, and **Swagger documentation**.

## Features

- **DDD + Hexagonal Architecture**: Clean separation of concerns with domain, application, infrastructure, and presentation layers
- **Event Sourcing**: Domain events recorded for all aggregate state changes
- **PostgreSQL + TypeORM**: Relational database with ORM
- **Redis Caching**: Per-user cache with automatic invalidation
- **Bull Queues**: Background job processing for notifications
- **JWT Authentication**: Secure API with Passport JWT strategy
- **Rate Limiting**: Configurable throttling per client
- **Scheduled Jobs**: Automatic cleanup of old completed todos
- **Swagger Docs**: Interactive API documentation at `/docs-api`
- **Global Exception Handling**: Consistent error responses

## Requirements

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Docker** and **Docker Compose** (for containerized deployment)
- **PostgreSQL**: v15+ (or use Docker)
- **Redis**: v7+ (or use Docker)

## Project Structure

```
src/
├── domain/           # Domain layer (pure TypeScript, no NestJS deps)
│   ├── user/         # User aggregate, events, repository interface
│   ├── category/     # Category aggregate
│   ├── todo/         # Todo aggregate
│   └── notification/ # Notification aggregate
├── application/      # Application layer (use cases, event store interface)
├── infrastructure/   # Infrastructure layer (TypeORM, Redis, Bull, Auth)
├── presentation/     # Presentation layer (controllers, DTOs, filters)
└── cli/              # CLI commands
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/AmirGhnbr/todo.git
cd todo
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables)).

## Running the Application

### Local Development (without Docker)

Ensure PostgreSQL and Redis are running locally, then:

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### With Docker Compose (Recommended)

Build and start all services:

```bash
docker-compose up --build
```

This starts:

- **api**: NestJS application on port 3000
- **postgres**: PostgreSQL database on port 5432
- **redis**: Redis server on port 6379

To stop:

```bash
docker-compose down
```

To stop and remove volumes:

```bash
docker-compose down -v
```

## Environment Variables

| Variable            | Description                              | Default       |
| ------------------- | ---------------------------------------- | ------------- |
| `DB_HOST`           | PostgreSQL host                          | `localhost`   |
| `DB_PORT`           | PostgreSQL port                          | `5432`        |
| `DB_USERNAME`       | Database username                        | `postgres`    |
| `DB_PASSWORD`       | Database password                        | `postgres`    |
| `DB_DATABASE`       | Database name                            | `nestdb`      |
| `REDIS_HOST`        | Redis host                               | `localhost`   |
| `REDIS_PORT`        | Redis port                               | `6379`        |
| `REDIS_DB`          | Redis database number                    | `0`           |
| `REDIS_PASSWORD`    | Redis password (optional)                | -             |
| `JWT_SECRET`        | Secret key for JWT signing               | `changeme`    |
| `JWT_EXPIRES_IN`    | JWT expiration in seconds                | `3600`        |
| `CACHE_TTL_SECONDS` | Cache TTL in seconds                     | `60`          |
| `THROTTLE_TTL`      | Rate limit window in seconds             | `60`          |
| `THROTTLE_LIMIT`    | Max requests per window                  | `100`         |
| `PORT`              | Application port                         | `3000`        |
| `NODE_ENV`          | Environment (`development`/`production`) | `development` |

## API Documentation (Swagger)

Once the application is running, access the interactive API documentation at:

```
http://localhost:3000/docs-api
```

### Available Endpoints

| Method   | Endpoint                  | Description               |
| -------- | ------------------------- | ------------------------- |
| `POST`   | `/auth/signup`            | Register a new user       |
| `POST`   | `/auth/login`             | Login and get JWT token   |
| `GET`    | `/categories`             | List user's categories    |
| `POST`   | `/categories`             | Create a category         |
| `GET`    | `/categories/:id`         | Get category by ID        |
| `PATCH`  | `/categories/:id`         | Update a category         |
| `DELETE` | `/categories/:id`         | Delete a category         |
| `GET`    | `/categories/:id/todos`   | List todos in category    |
| `GET`    | `/todos`                  | List user's todos         |
| `POST`   | `/todos`                  | Create a todo             |
| `GET`    | `/todos/:id`              | Get todo by ID            |
| `PATCH`  | `/todos/:id`              | Update a todo             |
| `DELETE` | `/todos/:id`              | Delete a todo             |
| `POST`   | `/todos/:id/complete`     | Mark todo as completed    |
| `GET`    | `/notifications/unread`   | List unread notifications |
| `POST`   | `/notifications`          | Create a notification     |
| `PATCH`  | `/notifications/:id/read` | Mark notification as read |

## Running Tests

### Unit Tests

```bash
npm test
```

### E2E Tests

Ensure PostgreSQL and Redis are running, then:

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## CLI Commands

### Manual Todo Cleanup

Delete completed todos older than 30 days:

```bash
npm run build
npm run cleanup:todos
```

## Git Branching Model

This project uses a simple branching strategy:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Individual feature branches

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed contribution guidelines.

## Architecture Highlights

### Domain Layer

- Pure TypeScript, no framework dependencies
- Aggregates: User, Category, Todo, Notification
- Value Objects: Email, TodoStatus
- Domain Events for all state changes

### Application Layer

- Use cases orchestrating domain logic
- Event store interface for event sourcing
- No infrastructure dependencies

### Infrastructure Layer

- TypeORM repositories implementing domain interfaces
- Redis cache with per-user keys
- Bull queue for background jobs
- Passport JWT for authentication
- @nestjs/schedule for cron jobs

### Presentation Layer

- REST controllers with Swagger annotations
- DTOs with class-validator
- Global exception filter
- JWT guards and cache interceptors

## Scripts

| Script                  | Description                 |
| ----------------------- | --------------------------- |
| `npm run build`         | Build the application       |
| `npm run start`         | Start in production mode    |
| `npm run start:dev`     | Start with hot reload       |
| `npm run start:debug`   | Start with debugger         |
| `npm test`              | Run unit tests              |
| `npm run test:e2e`      | Run E2E tests               |
| `npm run test:cov`      | Run tests with coverage     |
| `npm run lint`          | Run ESLint                  |
| `npm run format`        | Format code with Prettier   |
| `npm run cleanup:todos` | Manual cleanup of old todos |

## License

This project is [MIT licensed](LICENSE).

## Author

**Amir Ghanbari**
