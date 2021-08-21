import { Body, Controller, Get, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Post('/register')
	createUser(@Body() body: CreateUserDto) {
		// ! Should return auth token for now
		return this.usersService.create(body);
	}

	@Post('/login')
	logIn(@Body() body: CreateUserDto) {
		return 'Test route for future auth system';
	}

	@Get('/list')
	getUsersList() {
		return this.usersService.listAllUsers();
	}
}
