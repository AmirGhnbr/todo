import { Module } from '@nestjs/common';
import { AppController } from './presentation/controllers/app.controller';
import { AppService } from './presentation/services/app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class PresentationModule {}
