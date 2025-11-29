import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApplicationModule } from '../../application.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const raw = config.get<string>('JWT_EXPIRES_IN') ?? '3600';
        const seconds = parseInt(raw, 10);
        const expiresIn = Number.isNaN(seconds) ? 3600 : seconds;

        return {
          secret: config.get<string>('JWT_SECRET') ?? 'changeme',
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    ApplicationModule,
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard, ApplicationModule],
})
export class AuthModule {}
