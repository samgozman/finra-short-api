import { Controller, Get } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
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
}
