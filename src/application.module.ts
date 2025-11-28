import { Module } from '@nestjs/common';

// ARCHITECTURE NOTE:
// This Nest module is an adapter that wires application use cases into the Nest application.
// Files under src/application/** must NOT import NestJS or any infrastructure libraries.
@Module({})
export class ApplicationModule {}
