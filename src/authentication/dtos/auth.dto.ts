import { Expose } from 'class-transformer';

export class AuthDto {
	@Expose()
	login: string;

	@Expose()
	accessToken?: string;
}
