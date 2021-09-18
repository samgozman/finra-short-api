import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthenticationService } from './authentication.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { AuthDto } from './dtos/auth.dto';

@ApiTags('auth')
@Controller('auth')
@Serialize(AuthDto)
export class AuthenticationController {
	constructor(private authService: AuthenticationService) {}

	@ApiBearerAuth('ADMIN_SECRET')
	@ApiOperation({
		summary:
			'Register new user for API access (only possible with secret key for now)',
	})
	@UseGuards(AdminGuard)
	@Post('/register')
	register(@Body() authCredentialsDto: AuthCredentialsDto) {
		return this.authService.register(authCredentialsDto);
	}

	@Post('/login')
	@ApiOperation({
		summary: 'Login to get access token for /user and /collection routes',
	})
	logIn(
		@Body() authCredentialsDto: AuthCredentialsDto,
	): Promise<{ accessToken: string }> {
		return this.authService.login(authCredentialsDto);
	}
}
