import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { AuthCredentialsDto } from 'src/authentication/dtos/auth-credentials.dto';
import { AuthDto } from 'src/authentication/dtos/auth.dto';
import { UserDto } from 'src/models/users/dtos/user.dto';
import { ApiKeyDto } from 'src/models/users/dtos/apikey.dto';

const testUser: AuthCredentialsDto = {
	login: 'test-user-admin',
	pass: 'TestPass1234',
};

describe('Users route for unauthorized (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/user/list: should reject if the user is unauthorized', async () => {
		return request(app.getHttpServer()).get('/user/list').expect(401);
	});

	it('/user/api: should reject if the user is unauthorized', async () => {
		return request(app.getHttpServer())
			.post('/user/api')
			.send({ login: testUser.login })
			.expect(401);
	});

	it('/user/roles: should reject if the user is unauthorized', async () => {
		return request(app.getHttpServer())
			.patch('/user/roles')
			.send({
				login: testUser.login,
				role: 'stockInfo',
			})
			.expect(401);
	});
});

let connection: Connection;
/** Grant admin role for test user */
async function grantAdminRole() {
	// Set users role to admin
	await connection
		.collection('users')
		.updateOne(
			{ login: testUser.login },
			{ $set: { roles: ['admin'] } },
			{ upsert: true },
		);
}

describe('Users route for authorized (e2e)', () => {
	let app: INestApplication;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		connection = await moduleFixture.get(getConnectionToken());
		// Drop db before each
		await connection.dropDatabase();

		// Register user
		await request(app.getHttpServer())
			.post('/auth/register')
			.set('Authorization', 'Bearer ' + process.env.ADMIN_SECRET)
			.send(testUser);

		// Login user and get token
		const { body }: { body: AuthDto } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(testUser);

		token = body.accessToken;
	});

	it('/user/list: should get list of users', async () => {
		await grantAdminRole();
		const { body }: { body: UserDto[] } = await request(app.getHttpServer())
			.get('/user/list')
			.set('Authorization', 'Bearer ' + token)
			.expect(200);

		expect(body.length).toBeGreaterThan(0);
		expect(body[0].login).toEqual(testUser.login);
	});

	it('/user/list: should not get list of users if role is not an admin', async () => {
		return request(app.getHttpServer())
			.get('/user/list')
			.set('Authorization', 'Bearer ' + token)
			.expect(403);
	});

	it('/user/api: should get api key for user', async () => {
		await grantAdminRole();
		const { body }: { body: ApiKeyDto } = await request(app.getHttpServer())
			.post('/user/api')
			.set('Authorization', 'Bearer ' + token)
			.send({ login: testUser.login })
			.expect(201);

		expect(body.apikey.split(':').length).toEqual(2);
	});

	it('/user/api: should not get api key if role is not an admin', async () => {
		return request(app.getHttpServer())
			.post('/user/api')
			.set('Authorization', 'Bearer ' + token)
			.send({ login: testUser.login })
			.expect(403);
	});

	it('/user/roles: should set new user role', async () => {
		await grantAdminRole();
		const { body }: { body: UserDto } = await request(app.getHttpServer())
			.patch('/user/roles')
			.set('Authorization', 'Bearer ' + token)
			.send({
				login: testUser.login,
				role: 'stockInfo',
			})
			.expect(200);

		expect(body.roles).toEqual(['admin', 'stockInfo']);
	});

	it('/user/roles: should not set new user role if current role is not an admin', async () => {
		return request(app.getHttpServer())
			.patch('/user/roles')
			.set('Authorization', 'Bearer ' + token)
			.send({
				login: testUser.login,
				role: 'stockInfo',
			})
			.expect(403);
	});
});
