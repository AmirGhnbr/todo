import { Module } from '@nestjs/common';
import { AppController } from './presentation/controllers/app.controller';
import { AppService } from './presentation/services/app.service';

// ARCHITECTURE NOTE:
// Presentation layer: HTTP/transport adapters (controllers, filters, interceptors, DTOs).
// Use DTOs + class-validator for request/response shapes. Do NOT place business logic here.
@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class PresentationModule {}
