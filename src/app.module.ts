import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';
import { UsersModule } from './models/users/users.module';
import { StocksModule } from './models/stocks/stocks.module';
import { VolumesModule } from './models/volumes/volumes.module';
import { FiltersModule } from './models/filters/filters.module';
import { CollectionModule } from './models/collection/collection.module';
import { MongoExceptionFilter } from './exceptions/mongo-exception.filter';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `config/.${process.env.NODE_ENV}.env`,
			validationSchema: configValidationSchema,
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
		UsersModule,
		StocksModule,
		VolumesModule,
		FiltersModule,
		CollectionModule,
		AuthenticationModule,
	],
	controllers: [AppController],
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
	],
})
export class AppModule {}
