import supertest from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app';
import { setupDB, userAdmin } from '../fixtures/db';

beforeEach(setupDB);
afterAll(() => {
    mongoose.connection.close();
});

test('Should get correct user', async () => {
    const { body } = await supertest(app)
        .get('/user/list')
        .set('Authorization', `Bearer ${process.env.ADMIN_KEY}`)
        .send()
        .expect(200);

    expect(userAdmin.login).toBe(body[0].login);
});

test('Should register new user and get his token', async () => {
    const testUser = { login: 'NewUser' };
    const { body } = await supertest(app)
        .post('/user/add')
        .send(testUser)
        .set('Authorization', `Bearer ${process.env.ADMIN_KEY}`)
        .expect('Content-Type', /json/)
        .expect(201);

    expect(testUser.login).toBe(body.login);
    expect(typeof body.token).toBe('string');
    expect(typeof body.token).not.toBeNull();
});
