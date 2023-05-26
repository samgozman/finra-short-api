import {
	BadRequestException,
	ConflictException,
	ImATeapotException,
	NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { UsersRepository } from './repositories/users.repository';
import { IUserDocument, UserPrivileges } from './schemas/user.schema';
import { UsersService } from './users.service';

// implements Partial<UserModel>
/** Mock user model */
class MockUserModel {
	apiKey?: string;
	constructor(
		public login: string,
		public pass: string,
		public roles: UserPrivileges[] = [],
	) {}

	save() {
		return Promise.resolve(this);
	}
}

class MockUsersRepository {
	findOne(filter: FilterQuery<IUserDocument>): Promise<MockUserModel> {
		const user = usersArr.filter((e) => {
			return e.login === filter.login;
		})[0];
		return Promise.resolve(user);
	}

	find(filter: any): Promise<MockUserModel[]> {
		return Promise.resolve(usersArr);
	}
}

const testUser = new MockUserModel('TestOne', '', [
	'admin',
	'stockInfo',
	'screener',
]);

const testUserTwo = new MockUserModel('TestTwo', '', ['stockInfo']);

const testUserThree = new MockUserModel('TestThree', '', []);

/** Define array of users instead of DB */
const usersArr: MockUserModel[] = [testUserTwo, testUser, testUserThree];

describe('UsersService', () => {
	let userService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{ provide: UsersRepository, useClass: MockUsersRepository },
			],
		}).compile();

		userService = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
	});

	it('findOne: should find one user', async () => {
		const user = await userService.findOne({ login: testUser.login });
		expect(user).toEqual(testUser);
	});

	it('findOne: should return an undefined if invalid login was provided', async () => {
		const user = await userService.findOne({ login: 'sjfjsfjsjf' });
		expect(user).toBeUndefined();
	});

	it('listAllUsers: should return an array of users', async () => {
		const users = await userService.listAllUsers();
		expect(users).toEqual(usersArr);
	});

	it('createApiKey: should generate an return an api key', async () => {
		const api = await userService.createApiKey(testUser.login);
		const [user, key] = api.apikey.split(':');
		expect(user).toEqual(testUser.login);
		expect(key.length).toEqual(64);
	});

	it('createApiKey: should return an error if the user is not found', () => {
		expect(userService.createApiKey('SomeSortOfUser')).rejects.toBeInstanceOf(
			NotFoundException,
		);
	});

	it('createApiKey: should return an error if the user has no rights', () => {
		expect(
			userService.createApiKey(testUserThree.login),
		).rejects.toBeInstanceOf(ImATeapotException);
	});

	it('updateRoles: should update user role', async () => {
		const updatedUser = await userService.updateRoles({
			login: testUserTwo.login,
			role: 'screener',
		});

		expect(updatedUser.roles).toContain('screener');
	});

	it('updateRoles: should return error on attempt to issue admin role', () => {
		expect(
			userService.updateRoles({
				login: testUserTwo.login,
				role: 'admin',
			}),
		).rejects.toBeInstanceOf(BadRequestException);
	});

	it('updateRoles: should return error if a role is allready exists in user object', () => {
		expect(
			userService.updateRoles({
				login: testUser.login,
				role: 'screener',
			}),
		).rejects.toBeInstanceOf(ConflictException);
	});
});
