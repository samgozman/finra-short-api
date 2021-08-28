import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApiKeyDto } from './dtos/apikey.dto';
import { CreateUserApiKeyDto } from './dtos/create-user-api-key.dto';
import { UpdateRolesDto } from './dtos/update-roles.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UsersController {
	constructor(private usersService: UsersService) {}

	/** Get list of all users */
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

	/** Add new roles for a user */
	@Patch('/roles')
	@Roles('admin')
	@Serialize(UserDto)
	@UseGuards(RolesGuard)
	updateUserRoles(@Body() updateRolesDto: UpdateRolesDto) {
		return this.usersService.updateRoles(updateRolesDto);
	}
}
