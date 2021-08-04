import mongoose from 'mongoose';

import { db_fill } from '../fixtures/db_fill';
import { FilterSupertest } from '../fixtures/FilterSupertest';

beforeAll(db_fill, 30000);
afterAll(() => {
    mongoose.connection.close();
});

test('Filter: limit and skip', async () => {
    await new FilterSupertest(5, 0).test(10, 5);
    await new FilterSupertest(5, 5).test(10, 5);
});

test('Filter: sort', async () => {
    const asc = ['AAL', 'ABBV', 'BLUE', 'KEY', 'POSH', 'RDS.A', 'SNOW', 'TSLA', 'ZYNE', 'ZYXI'];
    const desc = ['ZYXI', 'ZYNE', 'TSLA', 'SNOW', 'RDS.A', 'POSH', 'KEY', 'BLUE', 'ABBV', 'AAL'];

    const sort_asc = await new FilterSupertest(20, 0, { ticker: 'asc' }).test();
    const tickers_asc = sort_asc.body.stocks.map((e) => e.ticker);

    const sort_desc = await new FilterSupertest(20, 0, { ticker: 'desc' }).test();
    const tickers_desc = sort_desc.body.stocks.map((e) => e.ticker);

    expect(asc).toStrictEqual(tickers_asc);
    expect(desc).toStrictEqual(tickers_desc);
});
