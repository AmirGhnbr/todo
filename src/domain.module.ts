import { Module } from '@nestjs/common';

// ARCHITECTURE NOTE:
// This Nest module is an adapter that wires the pure domain layer into the Nest application.
// Files under src/domain/** must NOT import NestJS or any infrastructure libraries.
@Module({})
export class DomainModule {}
