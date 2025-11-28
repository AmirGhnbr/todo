import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainModule } from './domain.module';
import { ApplicationModule } from './application.module';
import { InfrastructureModule } from './infrastructure.module';
import { PresentationModule } from './presentation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const port = parseInt(configService.get<string>('DB_PORT') ?? '5432', 10);
        const username =
          configService.get<string>('DB_USERNAME') ??
          configService.get<string>('DB_USER') ??
          'postgres';
        const password =
          configService.get<string>('DB_PASSWORD') ??
          configService.get<string>('DB_PASS') ??
          'postgres';
        const database =
          configService.get<string>('DB_DATABASE') ??
          configService.get<string>('DB_NAME') ??
          'nestdb';
        const isDev = configService.get<string>('NODE_ENV') === 'development';

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST') ?? 'localhost',
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: isDev,
          logging: isDev,
        };
      },
      inject: [ConfigService],
    }),
    DomainModule,
    ApplicationModule,
    InfrastructureModule,
    PresentationModule,
  ],
})
export class AppModule {}
