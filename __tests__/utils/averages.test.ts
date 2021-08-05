import { connection, Types } from 'mongoose';

import { db_fill } from './../fixtures/db_fill';
import { averages } from '../../src/utils/averages';
import { Stock } from '../../src/models/Stock';

beforeAll(async () => {
    await db_fill(true);
}, 30000);
afterAll(async () => {
    await connection.close();
});

test('Should calculate averages for all stocks', async () => {
    await averages();
    const stock = await Stock.findById('609bb81c8f08b04b11f6aa66');
    expect(stock).not.toBeNull();
    expect(stock!.shortVolRatio20DAVG).toBe(59.97844742187406);
    expect(stock!.shortVolRatio5DAVG).toBe(48.25104424659973);
    expect(stock!.shortVolRatioLast).toBe(68.13724858257424);
}, 15000);
