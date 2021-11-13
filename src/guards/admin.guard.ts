import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

/** Protect the route from requests without ADMIN_SECRET key */
@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private configService: ConfigService) {}
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const auth: string = request.headers.authorization;

		if (auth === undefined) {
			return false;
		}

		// ! For now, use this method only with secret key from *.env
		const token = auth.split(' ')[1];
		if (token !== this.configService.get('ADMIN_SECRET')) {
			return false;
		}

		return true;
	}
}
