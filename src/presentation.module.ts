import { Module } from '@nestjs/common';
import { AppController } from './presentation/controllers/app.controller';
import { AppService } from './presentation/services/app.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { CategoryController } from './presentation/controllers/category.controller';
import { TodoController } from './presentation/controllers/todo.controller';
import { NotificationController } from './presentation/controllers/notification.controller';
import { AuthModule } from './infrastructure/auth/auth.module';
import { ApplicationModule } from './application.module';

@Module({
  imports: [AuthModule, ApplicationModule],
  controllers: [
    AppController,
    AuthController,
    CategoryController,
    TodoController,
    NotificationController,
  ],
  providers: [AppService],
})
export class PresentationModule {}
