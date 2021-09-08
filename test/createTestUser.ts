import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { AuthCredentialsDto } from 'src/authentication/dtos/auth-credentials.dto';
import { AuthDto } from 'src/authentication/dtos/auth.dto';
import { UserPrivileges } from 'src/models/users/schemas/user.schema';
import request from 'supertest';

/**
 * Create test user in mongodb for e2e testing
 * @param app nestjs app
 * @param connection mongoose connection
 * @param user users credentials
 * @param roles user roles array
 * @returns accessToken string
 */
export const createTestUser = async (
	app: INestApplication,
	connection: Connection,
	user: AuthCredentialsDto,
	roles: UserPrivileges[],
): Promise<string> => {
	// Register user
	await request(app.getHttpServer())
		.post('/auth/register')
		.set('Authorization', 'Bearer ' + process.env.ADMIN_SECRET)
		.send(user);

	// Set users roles
	await connection
		.collection('users')
		.updateOne({ login: user.login }, { $set: { roles } }, { upsert: true });

	// Login user and get token
	const { body }: { body: AuthDto } = await request(app.getHttpServer())
		.post('/auth/login')
		.send(user);

	return body.accessToken;
};
