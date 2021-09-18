import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthenticationService } from './authentication.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { AuthDto } from './dtos/auth.dto';
import { TokenDto } from './dtos/token.dto';

@ApiTags('auth')
@Controller('auth')
@Serialize(AuthDto)
export class AuthenticationController {
	constructor(private authService: AuthenticationService) {}

	@Post('/register')
	@UseGuards(AdminGuard)
	@ApiBearerAuth('ADMIN_SECRET')
	@ApiOperation({
		summary:
			'Register new user for API access (only possible with secret key for now)',
	})
	@ApiOkResponse({ description: 'Registred user', type: AuthDto })
	register(@Body() authCredentialsDto: AuthCredentialsDto) {
		return this.authService.register(authCredentialsDto);
	}

	@Post('/login')
	@Serialize(TokenDto)
	@ApiOperation({
		summary: 'Login to get access token for /user and /collection routes',
	})
	@ApiOkResponse({ description: 'Auth token for user', type: TokenDto })
	logIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<TokenDto> {
		return this.authService.login(authCredentialsDto);
	}
}
