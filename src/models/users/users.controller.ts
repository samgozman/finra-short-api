import {
	Body,
	Controller,
	Get,
	Patch,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApiKeyDto } from './dtos/apikey.dto';
import { CreateUserApiKeyDto } from './dtos/create-user-api-key.dto';
import { UpdateRolesDto } from './dtos/update-roles.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard())
@UseInterceptors(SentryInterceptor)
@ApiBearerAuth('auth-with-admin-role')
@ApiForbiddenResponse()
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('/list')
	@Serialize(UserDto)
	@Roles('admin')
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Get list of all users' })
	@ApiOkResponse({
		description: 'List of users response object',
		type: [UserDto],
	})
	getUsersList() {
		return this.usersService.listAllUsers();
	}

	@Post('/api')
	@Serialize(ApiKeyDto)
	@Roles('admin')
	@UseGuards(RolesGuard)
	@ApiOperation({
		summary: 'Create API key for user to get access to the filtering',
	})
	@ApiOkResponse({
		description: 'Object with new API key for user',
		type: ApiKeyDto,
	})
	getApiKey(@Body() createApiDto: CreateUserApiKeyDto) {
		return this.usersService.createApiKey(createApiDto.login);
	}

	@Patch('/roles')
	@Roles('admin')
	@Serialize(UserDto)
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Add new roles for a user' })
	@ApiOkResponse({
		description: 'User with roles response object',
		type: UserDto,
	})
	@ApiBadRequestResponse()
	@ApiNotFoundResponse()
	@ApiConflictResponse()
	updateUserRoles(@Body() updateRolesDto: UpdateRolesDto) {
		return this.usersService.updateRoles(updateRolesDto);
	}
}
