import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Any class
interface ClassConstructor {
	new (...args: any[]): {};
}

// Custom decorator to make interceptor implementation more simple
export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

// Sanitize data before objects are returned in a network response.
@Injectable()
export class SerializeInterceptor implements NestInterceptor {
	constructor(public dataDto: ClassConstructor) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data: ClassConstructor) => {
				// Show only keys that was directly Exposed by some DTO
				return plainToClass(this.dataDto, data, {
					excludeExtraneousValues: true,
				});
			}),
		);
	}
}
