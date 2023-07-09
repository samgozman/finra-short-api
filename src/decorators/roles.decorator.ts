import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../modules/users/enums/user-roles.enum';

/** Defines the minimum role to access to the route. Helper for RolesGuard.  */
export const Roles = (...roles: (keyof typeof UserRoles)[]) =>
  SetMetadata('roles', roles);
