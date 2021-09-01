import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { fn } from 'moment';
import {
	IStock,
	IStockDocument,
	Stock,
	StockModel,
	StockModelDefinition,
} from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { FinraAssignedReports, Volume } from '../volumes/schemas/volume.schema';
import { CollectionService } from './collection.service';
import { ParseService } from './parse.service';

const arrayOfTickers = ['AAPL', 'MSFT'];

const mockStock = (ticker?: 'AAPL'): Stock =>
	({
		ticker,
	} as Stock);

const mockAssignedRep: FinraAssignedReports = {
	AAPL: {
		date: new Date(),
		shortVolume: 4000,
		shortExemptVolume: 500,
		totalVolume: 10000,
	},
	MSFT: {
		date: new Date(),
		shortVolume: 7000,
		shortExemptVolume: 200,
		totalVolume: 15000,
	},
};

const mockAssignedRepNoDef: FinraAssignedReports = {
	PLTR: {
		date: new Date(),
		shortVolume: 7000,
		shortExemptVolume: 700,
		totalVolume: 9000,
	},
};

class MockParseService {
	getAllDaysPages() {
		return ['link1', 'link2', 'link3'];
	}

	getDataFromFile() {
		return Promise.resolve(mockAssignedRep);
	}
}

class MockStocksService {
	create(doc: any) {
		return { ...mockStock(doc.ticker), save: jest.fn() };
	}
}

const mockStockModel = {
	findOne: jest.fn((filters?: { ticker: string }) => {
		const { ticker } = filters;
		if (arrayOfTickers.includes(ticker)) {
			return Promise.resolve({ ticker, _id: 'SomeId' } as IStockDocument);
		} else {
			return Promise.resolve(undefined);
		}
	}),
};

class MockVolumeModel {
	insertMany() {
		return Promise.resolve(undefined);
	}
}

describe('CollectionService', () => {
	let collectionService: CollectionService;
	let model: StockModel;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [],
			controllers: [],
			providers: [
				CollectionService,
				{
					provide: ParseService,
					useClass: MockParseService,
				},
				{
					provide: StocksService,
					useClass: MockStocksService,
				},
				{
					provide: getModelToken(Stock.name),
					useValue: mockStockModel,
				},
				{
					provide: getModelToken(Volume.name),
					useClass: MockVolumeModel,
				},
			],
		}).compile();

		collectionService = moduleRef.get<CollectionService>(CollectionService);
	});

	it('should be defined', () => {
		expect(collectionService).toBeDefined();
	});

	it('createVolumeArray: should create volume array of pre-defined stocks', async () => {
		const volArr = await collectionService.createVolumeArray(mockAssignedRep);
		expect(volArr.length).toEqual(2);
		expect(volArr[0]._stock_id).toEqual('SomeId');
		expect(volArr[0].shortVolume).toEqual(mockAssignedRep.AAPL.shortVolume);
	});

	it('createVolumeArray: should create volume array of undefined stocks', async () => {
		const volArr = await collectionService.createVolumeArray(
			mockAssignedRepNoDef,
		);
		expect(volArr.length).toEqual(1);
		expect(volArr[0].shortVolume).toEqual(
			mockAssignedRepNoDef.PLTR.shortVolume,
		);
	});

	it('recreateFullDatabase: should run full db recreation without errors', async () => {
		await expect(collectionService.recreateFullDatabase()).resolves.toEqual(
			undefined,
		);
	});

	it('updateLastTradingDays: should run last days fetching without errors', async () => {
		await expect(collectionService.updateLastTradingDays()).resolves.toEqual(
			undefined,
		);
	});

	it('updateVolumesByLink: should run volume ipdate by link without errors', async () => {
		await expect(
			collectionService.updateVolumesByLink('http://link.com'),
		).resolves.toEqual(undefined);
	});
});
