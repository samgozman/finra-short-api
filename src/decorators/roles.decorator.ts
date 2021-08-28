import { SetMetadata } from '@nestjs/common';
import { UserPrivileges } from '../models/users/schemas/user.schema';

/** Defines the minimum role to access to the route. Helper for RolesGuard.  */
export const Roles = (...roles: UserPrivileges[]) =>
	SetMetadata('roles', roles);
