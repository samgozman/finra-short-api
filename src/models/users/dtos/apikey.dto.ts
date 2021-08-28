import { Expose } from 'class-transformer';

export class ApiKeyDto {
	@Expose()
	login: string;

	@Expose()
	apikey: string;
}
