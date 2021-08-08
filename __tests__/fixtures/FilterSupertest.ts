import supertest, { Response } from 'supertest';

import app from '../../src/app';
import { IRoutersFilter } from '../../src/routers/interface';
import { userAdmin } from './db';
import { User } from '../../src/models/User';
import { Filters, ISort } from '../../src/filter';

// Correct body type for supertest response
interface ResponseFilter extends Response {
    body: IRoutersFilter;
}

export class FilterSupertest {
    constructor(
        public limit: number = 25,
        public skip: number = 0,
        public sort: ISort = { field: 'ticker', dir: 'asc' },
        public filters?: Filters[]
    ) {}

    /**
     * Create filter request and test it's respose length
     * @param expectedCount Total results (in DB) count
     * @param expectedLength Number of stocks in response
     * @returns
     */
    async test(expectedCount?: number, expectedLength?: number): Promise<ResponseFilter> {
        // Get user auth token for test
        const { token } = (await User.findOne({ login: userAdmin.login }))!;
        let filtersStr = '';
        if (this.filters) filtersStr = this.filters.toString();
        const sortStr = `${this.sort.field}:${this.sort.dir}`;

        const path = `/filter?limit=${this.limit}&skip=${this.skip}&sort=${sortStr}&filters=${filtersStr}`;

        const response: ResponseFilter = await supertest(app)
            .get(path)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);

        if (expectedCount) expect(response.body.count).toBe(expectedCount);
        if (expectedLength) expect(response.body.stocks.length).toBe(expectedLength);

        // Test wrong auth
        await supertest(app).get(path).set('Authorization', 'Bearer 122323').send().expect(401);
        // Test no auth
        await supertest(app).get(path).send().expect(401);

        return response;
    }
}
