import { MinLength, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@MinLength(4)
	login: string;

	@IsString()
	@MinLength(8)
	pass: string;
}
