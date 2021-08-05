// Протестировать множественное обновление фильтров. Создаст ли это лишние записи?
import mongoose from 'mongoose';

import { db_fill } from './fixtures/db_fill';
import { updateAllFilters } from '../src/filter';
import { Filter } from '../src/models/Filter';

beforeAll(async () => {
    await db_fill(true);
}, 30000);
afterAll(async () => {
    await mongoose.connection.close();
});

test('Test recreation of filters', async () => {
    await updateAllFilters();
    expect(await Filter.countDocuments()).toBe(10);
}, 30000);
