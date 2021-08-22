import { MinLength, IsString, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
	@IsString()
	@MinLength(4)
	login: string;

	@IsString()
	@MinLength(8)
	@MaxLength(32)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is to weak',
	})
	pass: string;
}
