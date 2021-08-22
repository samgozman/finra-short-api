import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthenticationService } from './authentication.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
@Serialize(AuthDto)
export class AuthenticationController {
	constructor(private authService: AuthenticationService) {}

	// ! For now, use this method only with secret key from *.env
	@Post('/register')
	register(@Body() authCredentialsDto: AuthCredentialsDto) {
		return this.authService.register(authCredentialsDto);
	}

	@Post('/login')
	logIn(
		@Body() authCredentialsDto: AuthCredentialsDto,
	): Promise<{ accessToken: string }> {
		return this.authService.login(authCredentialsDto);
	}
}
