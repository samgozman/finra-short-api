import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = app.get<ConfigService>(ConfigService).get('PORT');
	app.use(helmet());
	app.use(compression());
	await app.listen(port);
}
bootstrap();
