import {
	Body,
	Controller,
	Post,
	Headers,
	ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthenticationService } from './authentication.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
@Serialize(AuthDto)
export class AuthenticationController {
	constructor(
		private configService: ConfigService,
		private authService: AuthenticationService,
	) {}

	@Post('/register')
	register(
		@Body() authCredentialsDto: AuthCredentialsDto,
		@Headers('Authorization') auth: string = '',
	) {
		// ! For now, use this method only with secret key from *.env
		const [a, token] = auth.split(' ');
		if (token !== this.configService.get('ADMIN_SECRET')) {
			throw new ForbiddenException('Secret key was not provided');
		}

		return this.authService.register(authCredentialsDto);
	}

	@Post('/login')
	logIn(
		@Body() authCredentialsDto: AuthCredentialsDto,
	): Promise<{ accessToken: string }> {
		return this.authService.login(authCredentialsDto);
	}
}
