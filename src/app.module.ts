import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';
import { AuthenticationModule } from './authentication/authentication.module';
import { HealthModule } from './health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/.${process.env.NODE_ENV}.env`,
      validationSchema: configValidationSchema,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50,
    }),
    AuthenticationModule,
    HealthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    AppService,
    // Apply this pipe on any request that flows into the application (instead of main.ts file)
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // Enable transformation in validation process
        transform: true,
        // Check that incoming request don't have unexpected keys (removes them)
        whitelist: true,
        // Throw an error on forbiden request
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
