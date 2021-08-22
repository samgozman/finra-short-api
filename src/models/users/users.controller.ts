import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApiKeyDto } from './dtos/apikey.dto';
import { CreateUserApiKeyDto } from './dtos/create-user-api-key.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('/list')
	@Serialize(UserDto)
	@Roles('admin')
	@UseGuards(RolesGuard)
	getUsersList() {
		return this.usersService.listAllUsers();
	}

	/** Create API key for user to get access to the filtering */
	@Post('/api')
	@Serialize(ApiKeyDto)
	@Roles('admin')
	@UseGuards(RolesGuard)
	getApiKey(@Body() createApiDto: CreateUserApiKeyDto) {
		return this.usersService.createApiKey(createApiDto.login);
	}
}
