import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { IStock, Stock } from '../stocks/schemas/stock.schema';
import { Filters, FilterUnitService } from './filter-unit.service';
import { FiltersService } from './filters.service';

const users: Partial<IStock>[] = [{ ticker: 'AAPL' }, { ticker: 'MSFT' }];

class MockUser {
	estimatedDocumentCount = () => Promise.resolve(users.length);

	aggregate = jest.fn().mockImplementationOnce((pipe: [any]) => {
		const fo: {} = pipe[0].$match;
		if (Object.keys(fo).length === 0) {
			return users;
		}
		return [];
	});
}

class MockFilterUnitService implements Partial<FilterUnitService> {
	tinkoffFilter(filter?: Filters) {
		return async () => {};
	}

	isNotGarbageFilter(filter?: Filters) {
		return async () => {};
	}

	volumeFilter(...any) {
		return async () => {};
	}

	createEmptyFilters = () => Promise.resolve();

	getFilter(...any): any {
		return Promise.resolve({
			count: 1,
			stocks: users.filter((e) => e.ticker === 'AAPL'),
		});
	}
}

describe('FiltersService', () => {
	let filtersService: FiltersService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [],
			controllers: [],
			providers: [
				FiltersService,
				{
					provide: getModelToken(Stock.name),
					useClass: MockUser,
				},
				{
					provide: FilterUnitService,
					useClass: MockFilterUnitService,
				},
			],
		}).compile();

		filtersService = moduleRef.get<FiltersService>(FiltersService);
	});

	it('should be defined', () => {
		expect(filtersService).toBeDefined();
	});

	it('updateAll: should generate filters collection without errors', async () => {
		await expect(filtersService.updateAll()).resolves.toBe(undefined);
	});

	it('should get all aggregated stocks', async () => {
		const users = await filtersService.get({
			limit: 25,
			skip: 0,
			sortby: 'ticker',
			sortdir: 'asc',
		});

		expect(users.count).toBe(2);
		expect(users.stocks).toContainEqual({ ticker: 'MSFT' });
	});

	it('should get only filtred stocks', async () => {
		const users = await filtersService.get({
			limit: 25,
			skip: 0,
			sortby: 'ticker',
			sortdir: 'asc',
			filters: ['isNotGarbage'],
		});

		expect(users.count).toBe(1);
		expect(users.stocks).toContainEqual({ ticker: 'AAPL' });
	});
});
