import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';
import { UsersModule } from './models/users/users.module';
import { StocksModule } from './models/stocks/stocks.module';
import { VolumesModule } from './models/volumes/volumes.module';
import { FiltersModule } from './models/filters/filters.module';
import { CollectionModule } from './models/collection/collection.module';
import { MongoExceptionFilter } from './exceptions/mongo-exception.filter';
import { AuthenticationModule } from './authentication/authentication.module';
import { HealthModule } from './health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@sentry/types';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `config/.${process.env.NODE_ENV}.env`,
			validationSchema:
				process.env.NODE_ENV !== 'github' ? configValidationSchema : undefined,
		}),
		ScheduleModule.forRoot(),
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					uri: config.get('MONGODB_CONNECTION_URL'),
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useCreateIndex: true,
					useFindAndModify: false,
				};
			},
		}),
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 50,
		}),
		SentryModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				dsn: config.get('SENTRY_DSN'),
				debug: true,
				environment: process.env.NODE_ENV,
				release: process.env.npm_package_version,
				logLevel: LogLevel.Debug,
			}),
		}),
		UsersModule,
		StocksModule,
		VolumesModule,
		FiltersModule,
		CollectionModule,
		AuthenticationModule,
		HealthModule,
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
			provide: APP_FILTER,
			useClass: MongoExceptionFilter,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
