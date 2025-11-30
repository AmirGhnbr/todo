import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DomainModule } from './domain.module';
import { ApplicationModule } from './application.module';
import { InfrastructureModule } from './infrastructure.module';
import { PresentationModule } from './presentation.module';

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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const ttl = parseInt(config.get<string>('THROTTLE_TTL') ?? '60', 10);
        const limit = parseInt(config.get<string>('THROTTLE_LIMIT') ?? '100', 10);
        return [
          {
            ttl,
            limit,
          },
        ];
      },
    }),
    DomainModule,
    ApplicationModule,
    InfrastructureModule,
    PresentationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
