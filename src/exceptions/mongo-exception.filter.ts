import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
	catch(exception: MongoError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		const errorMessage = (status: number, type: string, message: string) => {
			response.status(status).json({
				statusCode: status,
				path: request.url,
				errorType: type,
				errorMessage: message,
			});
		};

		// exception.message

		switch (exception.code) {
			case 11000:
				errorMessage(400, 'MongoDB error', 'Duplicate key');
				break;
		}
	}
}
