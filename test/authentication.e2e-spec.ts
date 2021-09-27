import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { AuthCredentialsDto } from 'src/authentication/dtos/auth-credentials.dto';

jest.setTimeout(30000);

const testUser: AuthCredentialsDto = {
	login: 'test-user',
	pass: 'TestPass1234',
};

const testUserTwo: AuthCredentialsDto = {
	login: 'test-user-two',
	pass: 'TestPass1234',
};

describe('AuthenticationController (e2e)', () => {
	let app: INestApplication;
	let connection: Connection;

	afterEach(async () => {
		await connection.close(true);
	});

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		connection = await moduleFixture.get(getConnectionToken());
		// Drop db before each
		await connection.dropDatabase();
	});

	it('/auth/register: reject in registration if request was without secret key', async () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send(testUser)
			.expect(403);
	});

	it('/auth/register: reject in registration if request was empty', async () => {
		return request(app.getHttpServer()).post('/auth/register').expect(403);
	});

	it('/auth/register: register new user successfully ', async () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.set('Authorization', 'Bearer ' + process.env.ADMIN_SECRET)
			.send(testUser)
			.expect(201);
	});

	it('/auth/login: should login user and return valid token', async () => {
		// Register
		await request(app.getHttpServer())
			.post('/auth/register')
			.set('Authorization', 'Bearer ' + process.env.ADMIN_SECRET)
			.send(testUser);

		// Login
		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(testUser)
			.expect(201);

		expect(body.accessToken).toBeDefined();
	});

	it('/auth/login: should reject on wrong user credentials', async () => {
		// Register
		await request(app.getHttpServer())
			.post('/auth/register')
			.set('Authorization', 'Bearer ' + process.env.ADMIN_SECRET)
			.send(testUser);

		// Login
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(testUserTwo)
			.expect(401);
	});
});
