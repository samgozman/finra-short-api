import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/models/users/schemas/user.schema';

/** Denies access to the resource for users who have insufficient rights. */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	matchRoles(roles: string[], userRoles: string[]) {
		return userRoles.every((v) => roles.includes(v));
	}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());

		if (!roles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user: User = request.user;

		if (!user) {
			return false;
		}

		return this.matchRoles(roles, user.roles);
	}
}
