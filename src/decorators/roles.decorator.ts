import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../modules/users/enums/user-roles.enum';

/** Defines the minimum role to access to the route. Helper for RolesGuard.  */
export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
