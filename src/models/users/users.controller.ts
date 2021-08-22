import { Body, Controller, Get, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserApiKeyDto } from './dtos/create-user-api-key.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('/list')
	getUsersList() {
		return this.usersService.listAllUsers();
	}

	/** Create API key for user to get access to the filtering */
	// ! Admin guard (login and have admin privilages)
	@Post('/api')
	getApiKey(@Body() createApiDto: CreateUserApiKeyDto) {
		return this.usersService.createApiKey(createApiDto.login);
	}
}
