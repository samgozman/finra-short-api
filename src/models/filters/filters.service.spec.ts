import { Test } from '@nestjs/testing';
import { StocksRepository } from '../stocks/repositories/stocks.repository';
import { IStock } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { FilterUnitService } from './filter-unit.service';
import { FiltersService } from './filters.service';

const stocks: Partial<IStock>[] = [{ ticker: 'AAPL' }, { ticker: 'MSFT' }];

class MockStockRepository {
	getAllStocks = () =>
		Promise.resolve({
			count: 2,
			stocks,
		});
}

class MockFilterUnitService implements Partial<FilterUnitService> {
	getFilter(): any {
		return Promise.resolve({
			count: 1,
			stocks: stocks.filter((e) => e.ticker === 'AAPL'),
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

	it('should get all aggregated stocks', async () => {
		const res = await filtersService.get({
			limit: 25,
			skip: 0,
			sortby: 'ticker',
			sortdir: 'asc',
		});

		expect(res.count).toBe(2);
		expect(res.stocks).toContainEqual({ ticker: 'MSFT' });
	});

	it('should get only filtered stocks', async () => {
		const res = await filtersService.get({
			limit: 25,
			skip: 0,
			sortby: 'ticker',
			sortdir: 'asc',
			filters: ['isNotGarbage'],
		});

		expect(res.count).toBe(1);
		expect(res.stocks).toContainEqual({ ticker: 'AAPL' });
	});
});
