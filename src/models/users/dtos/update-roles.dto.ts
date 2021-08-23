import { IsDefined, IsEnum, IsString, MinLength } from 'class-validator';
import { UserPrivileges, UserRules } from '../schemas/user.schema';

export class UpdateRolesDto {
	@IsString()
	@MinLength(4)
	login: string;

	@IsDefined()
	@IsEnum(UserRules)
	role: UserPrivileges;
}
