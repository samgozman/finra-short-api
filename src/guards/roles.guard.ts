import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { compare } from 'bcryptjs';
import { User } from '../modules/users/user.entity';
import { UsersService } from '../modules/users/users.service';

/** Denies access to the resource for users who have insufficient rights. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  matchRoles(roles: string[], userRoles: string[]) {
    return roles.every((v) => userRoles.includes(v));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let user: User = request.user;

    // If no user, than associate one by API key if provided
    if (!user) {
      const apiToken: string = request.headers.token;
      if (!apiToken) {
        return false;
      }

      // Find user by API key (send with api key like user:key)
      const [login, token] = apiToken.split(':');
      if (!login || !token) {
        return false;
      }

      const userFromDb = await this.usersService.findOne({ login });
      if (!userFromDb) {
        return false;
      }

      if (!userFromDb.apikey) {
        throw new ForbiddenException('The user does not have an API key');
      }

      user = userFromDb;

      // Compare bcrypt token
      const compareResult = await compare(token, user.apikey);
      if (!compareResult) {
        return false;
      }
    }

    return this.matchRoles(roles, user.roles);
  }
}
