import mongoose from 'mongoose';

import { db_fill } from '../fixtures/db_fill';
import { FilterSupertest } from '../fixtures/FilterSupertest';

beforeAll(db_fill, 30000);
afterAll(() => {
    mongoose.connection.close();
});

test('Filter: limit and skip', async () => {
    // Get user auth token for test
    const filterLimit = await new FilterSupertest(5, 0).test();
    expect(filterLimit.body.count).toBe(10);
    expect(filterLimit.body.stocks.length).toBe(5);
}, 30000);
