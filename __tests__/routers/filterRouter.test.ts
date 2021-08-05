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

    const sort_asc = await new FilterSupertest(20, 0, { field: 'ticker', dir: 'asc' }).test();
    const tickers_asc = sort_asc.body.stocks.map((e) => e.ticker);

    const sort_desc = await new FilterSupertest(20, 0, { field: 'ticker', dir: 'desc' }).test();
    const tickers_desc = sort_desc.body.stocks.map((e) => e.ticker);

    expect(asc).toStrictEqual(tickers_asc);
    expect(desc).toStrictEqual(tickers_desc);
});

test('Filter: by one field', async () => {
    await new FilterSupertest(20, 0, { field: 'ticker', dir: 'asc' }, ['isNotGarbage']).test(10);
    await new FilterSupertest(20, 0, { field: 'ticker', dir: 'asc' }, ['onTinkoff']).test(9);
    await new FilterSupertest(20, 0, { field: 'ticker', dir: 'asc' }, [
        'shortExemptVolRatioDecreases3D',
    ]).test(2);
    await new FilterSupertest(20, 0, { field: 'ticker', dir: 'asc' }, ['shortVolGrows3D']).test(2);
});

test('Filter: by multiple fields', async () => {
    await new FilterSupertest(20, 0, { field: 'ticker', dir: 'asc' }, ['onTinkoff', 'isNotGarbage']).test(9);
    const complexQuery = await new FilterSupertest(20, 0, { field: 'ticker', dir: 'asc' }, [
        'onTinkoff',
        'isNotGarbage',
        'shortVolGrows3D',
        'totalVolGrows3D',
    ]).test(1);

    expect(complexQuery.body.stocks[0].ticker).toBe('KEY');
});

test('Filter: by multiple fields with sorting and pagination', async () => {
    const testArray = ['BLUE', 'POSH', 'ZYXI', 'KEY'];
    const { body } = await new FilterSupertest(5, 5, { field: 'shortVolRatio5DAVG', dir: 'asc' }, [
        'onTinkoff',
        'isNotGarbage',
    ]).test(9, 4);

    expect(body.stocks.map((e) => e.ticker)).toStrictEqual(testArray);
});
