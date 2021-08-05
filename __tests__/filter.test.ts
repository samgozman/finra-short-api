import { connection, Types } from 'mongoose';

import { db_fill } from './fixtures/db_fill';
import { updateAllFilters, getFilter } from '../src/filter';
import { Filter } from '../src/models/Filter';

beforeAll(async () => {
    await db_fill(true);
}, 30000);
afterAll(async () => {
    await connection.close();
});

test('Test recreation of filters', async () => {
    await updateAllFilters();
    expect(await Filter.countDocuments()).toBe(10);

    const filter = await Filter.findOne({ _stock_id: new Types.ObjectId('609ae9a6baea6221768537e8') });
    expect(filter).not.toBeNull();
}, 30000);

test('Should get filter by `getFilter` function', async () => {
    const filter = await getFilter(['onTinkoff', 'isNotGarbage', 'shortVolGrows3D', 'totalVolGrows3D']);
    expect(filter.stocks[0].ticker).toBe('KEY');
});
