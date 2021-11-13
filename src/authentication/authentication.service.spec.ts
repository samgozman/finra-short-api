import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserPrivileges } from '../models/users/schemas/user.schema';
import { UsersService } from '../models/users/users.service';
import { AuthenticationService } from './authentication.service';

let user: MockUserModel;

class MockUserService implements Partial<UsersService> {
	findOne(): any {
		return Promise.resolve(user);
	}
}

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

class MockJwtService implements Partial<JwtService> {
	sign(): string {
		return 'ASDFGHJKQWERTYUIZXCVBNM';
	}
}

describe('AuthenticationService', () => {
	let service: AuthenticationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthenticationService,
				JwtService,
				{
					provide: JwtService,
					useClass: MockJwtService,
				},
				{
					provide: getModelToken(User.name),
					useValue: MockUserModel,
				},
				{
					provide: UsersService,
					useClass: MockUserService,
				},
			],
		}).compile();

		service = module.get<AuthenticationService>(AuthenticationService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
