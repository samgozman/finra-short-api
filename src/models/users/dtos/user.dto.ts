import { Expose } from 'class-transformer';

export class UserDto {
	@Expose()
	login: string;

	@Expose()
	apikey?: string;
}
