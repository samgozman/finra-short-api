import supertest from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app';
import { setupDB, userAdmin } from '../fixtures/db';

beforeEach(setupDB);
afterAll(() => {
    mongoose.connection.close();
});

test('Shoud get correct user', async () => {
    const { body } = await supertest(app)
        .get('/user/list')
        .set('Authorization', `Bearer ${process.env.ADMIN_KEY}`)
        .send()
        .expect(200);

    expect(userAdmin.login).toBe(body[0].login);
});
