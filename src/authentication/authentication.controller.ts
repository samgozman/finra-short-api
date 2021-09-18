import {
	Body,
	Controller,
	Post,
	Headers,
	ForbiddenException,
	UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthenticationService } from './authentication.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { AuthDto } from './dtos/auth.dto';

@ApiTags('auth')
@Controller('auth')
@Serialize(AuthDto)
export class AuthenticationController {
	constructor(
		private configService: ConfigService,
		private authService: AuthenticationService,
	) {}

	@ApiBearerAuth('ADMIN_SECRET')
	@UseGuards(AdminGuard)
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
