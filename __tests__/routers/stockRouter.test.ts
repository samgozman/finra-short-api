import supertest, { Response } from 'supertest';
import { connection } from 'mongoose';

import app from '../../src/app';
import { userAdmin } from '../fixtures/db';
import { db_fill } from '../fixtures/db_fill';
import { User } from '../../src/models/User';
import { IRoutersStock } from '../../src/routers/interface';
import reportSample from '../fixtures/db_data/reportSample.json';

// Correct body type for supertest response
interface ResponseStock extends Response {
    body: IRoutersStock;
}

beforeAll(async () => {
    await db_fill(true);
}, 30000);
afterAll(async () => {
    await connection.close();
});

test('Stock: should get stock on response', async () => {
    const { token } = (await User.findOne({ login: userAdmin.login }))!;
    const response: ResponseStock = await supertest(app)
        .get('/stock?ticker=ZYNE&limit=21&sort=desc')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);
    expect(response.body).toStrictEqual(reportSample);
});

test('Stock: should get 404 on error request', async () => {
    const { token } = (await User.findOne({ login: userAdmin.login }))!;
    await supertest(app)
        .get('/stock?ticker=undefined')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(404);
});

test('Stock: should get 401 on wrong auth', async () => {
    // Wrong auth
    await supertest(app)
        .get('/stock?ticker=ZYNE&limit=21&sort=desc')
        .set('Authorization', 'Bearer 1234567890')
        .send()
        .expect(401);

    // No auth
    await supertest(app).get('/stock?ticker=ZYNE&limit=21&sort=desc').send().expect(401);
});
