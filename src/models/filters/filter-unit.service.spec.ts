import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { Stock } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { VolumesService } from '../volumes/volumes.service';
import { FilterUnitService } from './filter-unit.service';
import { FiltersRepository } from './repositories/filters.repository';
import { IFilterDocument } from './schemas/filter.schema';

let mockIdsArr = ['id1', 'id2'];

const mockStocks: Stock[] = [
	{ ticker: 'AAPL' } as Stock,
	{ ticker: 'MSFT' } as Stock,
	{ ticker: 'PLTR' } as Stock,
];

class MockStocksService {
	availableTickers = () => Promise.resolve(mockIdsArr);
	findOne = () => Promise.resolve(mockStocks[0]);
	findMany = () => Promise.resolve(mockStocks);
}

class MockVolumesService {}

class MockFilter {
	constructor(public ops: Partial<IFilterDocument>) {}
	save = () => Promise.resolve(this);
	updateOne = () => Promise.resolve(this);
}

class MockFiltersRepository {
	dropCollection = () => Promise.resolve(undefined);

	new(ops: Partial<IFilterDocument>) {
		return new MockFilter(ops);
	}

	findOne(filter?: FilterQuery<IFilterDocument>) {
		return Promise.resolve(
			new MockFilter({ _stock_id: filter._stock_id as any }),
		);
	}

	findStocksByFilteringCondition(...any) {
		return [mockStocks[0], mockStocks[1]];
	}

	createBlankFiltersArray() {
		return [];
	}
}

describe('FilterUnitService', () => {
	let filterUnitService: FilterUnitService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					envFilePath: `config/.${process.env.NODE_ENV}.env`,
				}),
			],
			providers: [
				FilterUnitService,
				ConfigService,
				{
					provide: StocksService,
					useClass: MockStocksService,
				},
				{
					provide: VolumesService,
					useClass: MockVolumesService,
				},
				{
					provide: FiltersRepository,
					useClass: MockFiltersRepository,
				},
			],
		}).compile();

		filterUnitService = moduleRef.get<FilterUnitService>(FilterUnitService);

		// Define private properties
		Object.defineProperty(filterUnitService, 'filters', {
			value: Promise.resolve([]),
		});
	});

	it('should be defined', () => {
		expect(filterUnitService).toBeDefined();
	});

	it('getFilter: should get an array of stocks matching the filter', async () => {
		const res = await filterUnitService.getFilter({
			limit: 1,
			skip: 0,
			sortby: 'ticker',
			sortdir: 'asc',
			filters: ['isNotGarbage'],
		});

		expect(res).toEqual([mockStocks[0], mockStocks[1]]);
	});
});
