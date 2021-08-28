import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRolesDto } from './dtos/update-roles.dto';
import { User } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUser: Partial<User> = {
	login: 'kekes',
	roles: ['stockInfo'],
};

class MockUserService implements Partial<UsersService> {
	listAllUsers(): any {
		return ['kekes', 'test'];
	}

	async createApiKey(): Promise<{
		apikey: string;
	}> {
		return Promise.resolve({ apikey: 'lsdskd' });
	}

	async updateRoles(urd: UpdateRolesDto): Promise<any> {
		mockUser.roles.push(urd.role);
		return Promise.resolve(mockUser);
	}
}

describe('UsersController', () => {
	let controller: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
			providers: [
				{
					provide: UsersService,
					useClass: MockUserService,
				},
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('getApiKey: Should get api key', async () => {
		const res = await controller.getApiKey({ login: 'kek' });
		expect(res.apikey).toBeDefined();
	});

	it('listAllUsers: Should get list of users', async () => {
		const res = await controller.getUsersList();
		expect(res.length).toEqual(2);
	});

	it('updateUserRoles: Should add new role for user', async () => {
		const res = await controller.updateUserRoles({
			login: 'kekes',
			role: 'screener',
		});
		expect(res.roles).toContain('screener');
	});
});
