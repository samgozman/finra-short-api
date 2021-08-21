import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Post('/register')
	createUser(@Body() body: CreateUserDto) {
		// ! Should return auth token for now
		return this.usersService.create(body.login, body.pass);
	}

	@Post('/login')
	logIn(@Body() body: CreateUserDto) {
		return 'Test route for future auth system';
	}

	@Get('/list')
	getUsersList() {
		return 'Users list';
	}
}
