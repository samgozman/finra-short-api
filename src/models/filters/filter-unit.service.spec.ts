import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { Stock } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { IVolumeDocument } from '../volumes/schemas/volume.schema';
import { VolumesService } from '../volumes/volumes.service';
import { FiltredStocksDto } from './dtos/filtred-stocks.dto';
import { FilterUnitService } from './filter-unit.service';
import { FiltersRepository } from './repositories/filters.repository';
import { IFilterDocument } from './schemas/filter.schema';

let mockIdsArr = ['id1', 'id2'];

const mockStocks: Stock[] = [
	{ ticker: 'AAPL' } as Stock,
	{ ticker: 'MSFT' } as Stock,
	{ ticker: 'PLTR' } as Stock,
];

const lastDate = new Date();

const mockVolume: IVolumeDocument[] = [
	{
		date: lastDate,
		shortVolume: 11000,
		shortExemptVolume: 100,
		totalVolume: 20000,
	} as IVolumeDocument,
	{
		date: lastDate,
		shortVolume: 11000,
		shortExemptVolume: 0,
		totalVolume: 18000,
	} as IVolumeDocument,
	{
		date: lastDate,
		shortVolume: 11000,
		shortExemptVolume: 0,
		totalVolume: 20000,
	} as IVolumeDocument,
	{
		date: lastDate,
		shortVolume: 17000,
		shortExemptVolume: 1000,
		totalVolume: 25000,
	} as IVolumeDocument,
	{
		date: lastDate,
		shortVolume: 15000,
		shortExemptVolume: 150,
		totalVolume: 21000,
	} as IVolumeDocument,
];

const mockStocksFiltedTest: FiltredStocksDto = {
	count: mockStocks.length,
	stocks: [mockStocks[0], mockStocks[1]],
};

class MockStocksService {
	availableTickers = () => Promise.resolve(mockIdsArr);
	findOne = () => Promise.resolve(mockStocks[0]);
}

class MockVolumesService {
	lastDateTime = () => Promise.resolve(lastDate.getTime());
	findMany = () => Promise.resolve(mockVolume);
}

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

	countDocuments(fl: any) {
		return mockStocks.length;
	}

	findOne(filter?: FilterQuery<IFilterDocument>) {
		return Promise.resolve(
			new MockFilter({ _stock_id: filter._stock_id as any }),
		);
	}

	findStocksByFilteringCondition(...any) {
		return [mockStocks[0], mockStocks[1]];
	}
}

describe('FilterUnitService', () => {
	let filterUnitService: FilterUnitService;
	let config: ConfigService;

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
		config = moduleRef.get<ConfigService>(ConfigService);
	});

	it('should be defined', () => {
		expect(filterUnitService).toBeDefined();
	});

	it('createEmptyFilters: should create empty filters', async () => {
		await filterUnitService.createEmptyFilters();
	});

	it('getFilter: should get an array of stocks matching the filter', async () => {
		const res = await filterUnitService.getFilter(['isNotGarbage'], 1, 0, {
			field: 'ticker',
			dir: 'asc',
		});

		expect(res).toEqual(mockStocksFiltedTest);
	});

	it('isNotGarbageFilter: should run without errors', async () => {
		const filter = filterUnitService.isNotGarbageFilter();
		await expect(filter()).resolves.toEqual(undefined);
	});

	it('tinkoffFilter: should run without errors', async () => {
		const filter = filterUnitService.tinkoffFilter();
		await expect(filter()).resolves.toEqual(undefined);
	});

	it('volumeFilter: should run without errors', async () => {
		const filter = filterUnitService.volumeFilter(
			'totalVolGrows3D',
			'totalVolume',
			'growing',
			3,
		);
		await expect(filter()).resolves.toEqual(undefined);
	});
});
