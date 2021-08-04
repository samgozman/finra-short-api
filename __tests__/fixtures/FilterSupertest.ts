import supertest, { Response } from 'supertest';

import { IRoutersFilter } from '../../src/routers/interface';
import app from '../../src/app';
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
        public filters?: Filters[],
        public sort: ISort = { ticker: 'asc' }
    ) {}

    async test(): Promise<ResponseFilter> {
        // Get user auth token for test
        const { token } = (await User.findOne({ login: userAdmin.login }))!;
        let filtersStr = '';
        if (this.filters) filtersStr = this.filters.toString();
        const sortStr = `${Object.keys(this.sort)[0]}:${Object.values(this.sort)[0]}`;

        const filterLimit: ResponseFilter = await supertest(app)
            .get(`/filter?limit=${this.limit}&skip=${this.skip}&sort=${sortStr}&filters=${filtersStr}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);

        return filterLimit;
    }
}
