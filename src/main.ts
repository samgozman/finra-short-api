import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { SentryFilter } from './exceptions/sentry.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = app.get<ConfigService>(ConfigService).get<number>('PORT');

	// Config swagger
	const config = new DocumentBuilder()
		.setTitle('TightShorts API')
		.setDescription(
			`FINRA short volume parser. Access to the TightShorts API is only possible for the owners. 
			API keys are not issued to outsiders for now. The information is presented for your reference.`,
		)
		.setVersion(process.env.npm_package_version)
		.setLicense(
			'MIT',
			'https://github.com/samgozman/finra-short-api/blob/main/LICENSE',
		)
		.addApiKey(
			{
				type: 'apiKey',
				name: 'token',
				in: 'header',
				description:
					'Personal users API key. Only admin can generate API key for user via /user/api',
			},
			'user-api-token',
		)
		.addBearerAuth(
			{
				type: 'http',
				in: 'header',
				description:
					'You can get access token after successful login via /auth/login',
			},
			'auth-with-admin-role',
		)
		.addBearerAuth(
			{
				type: 'http',
				in: 'header',
				description: 'Admin secret key for user registration',
			},
			'ADMIN_SECRET',
		)
		.addTag('stock', 'Get stock info. Needs an `user-api-token` for request')
		.addTag(
			'filter',
			'Get filtered stocks. Needs an `user-api-token` for request',
		)
		.addTag(
			'auth',
			'Signup / login for the new user. New signup is only possible with `ADMIN_SECRET` key for now.',
		)
		.addTag('user', 'Methods for API users')
		.addTag(
			'collection',
			'Methods for DB regeneration. Only for authorized users with `admin` role.',
		)
		.addTag('health', 'Check app health')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	// Capture routers performance with Sentry
	const sentryDsn = app.get<ConfigService>(ConfigService).get<string>('SENTRY_DSN');
	const sentryTsr = app.get<ConfigService>(ConfigService).get<number>('SENTRY_TRACE_RATE');
	Sentry.init({
		dsn: sentryDsn,
		debug: true,
		environment: process.env.NODE_ENV,
		release: process.env.npm_package_version,
		integrations: [
			// enable HTTP calls tracing
			new Sentry.Integrations.Http({ tracing: true }),
		],
		tracesSampleRate: sentryTsr,
	});	
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new SentryFilter(httpAdapter));

	app.use(helmet());
	app.use(compression());

	await app.listen(port);
}
bootstrap();
