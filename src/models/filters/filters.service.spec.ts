import { Test } from '@nestjs/testing';
import { StocksRepository } from '../stocks/repositories/stocks.repository';
import { IStock } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { Filters, FilterUnitService } from './filter-unit.service';
import { FiltersService } from './filters.service';

const stocks: Partial<IStock>[] = [{ ticker: 'AAPL' }, { ticker: 'MSFT' }];

class MockStockRepository {
	getAllStocks = () => Promise.resolve(stocks);
	estimatedDocumentCount = () => Promise.resolve(stocks.length);
}

class MockFilterUnitService implements Partial<FilterUnitService> {
	tinkoffFilter() {
		return async () => {};
	}

	isNotGarbageFilter() {
		return async () => {};
	}

	volumeFilter() {
		return async () => {};
	}

	abnormalVolumeFilter() {
		return async () => {};
	}

	getFilter(): any {
		return Promise.resolve({
			count: 1,
			stocks: stocks.filter((e) => e.ticker === 'AAPL'),
		});
	}

	saveFilters() {
		return Promise.resolve(undefined);
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
				StocksService,
				{
					provide: StocksRepository,
					useClass: MockStockRepository,
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

	it('should get only filtered stocks', async () => {
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
