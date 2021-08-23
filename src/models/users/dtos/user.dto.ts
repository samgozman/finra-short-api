import { Expose } from 'class-transformer';
import { UserPrivileges } from '../schemas/user.schema';

export class UserDto {
	@Expose()
	login: string;

	@Expose()
	roles: UserPrivileges[];
}
