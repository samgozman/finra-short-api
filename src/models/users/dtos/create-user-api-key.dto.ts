import { IsString, MinLength } from 'class-validator';

export class CreateUserApiKeyDto {
	@IsString()
	@MinLength(4)
	login: string;
}
