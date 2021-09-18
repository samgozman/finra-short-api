import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = app.get<ConfigService>(ConfigService).get('PORT');

	// Config swagger
	const config = new DocumentBuilder()
		.setTitle('TightShorts API')
		.setDescription('FINRA short volume parser')
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
		.addTag('stock')
		.addTag('filter')
		.addTag('auth')
		.addTag('user')
		.addTag(
			'collection',
			'Methods for DB regeneration. Only for authorized users with `admin` role.',
		)
		.addTag('health')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.use(helmet());
	app.use(compression());

	await app.listen(port);
}
bootstrap();
