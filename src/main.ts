import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SentryService } from '@ntegral/nestjs-sentry';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const sentryService = app.get<SentryService>(SentryService);
	const port = app.get<ConfigService>(ConfigService).get('PORT');

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
	app.use(sentryService.instance().Handlers.requestHandler());
		// ! Sentry bug
	// app.use(sentryService.instance().Handlers.tracingHandler());
	app.use(helmet());
	app.use(compression());

	await app.listen(port);
}
bootstrap();
