import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { IStockDocument, Stock, StockModel } from './schemas/stock.schema';
import { StocksService } from './stocks.service';

class MockStock {
	constructor(public _id: string, public ticker: string) {}
}

const mockStockAapl = new MockStock('1234', 'AAPL');
const mockStockMsft = new MockStock('5678', 'MSFT');
const stockArr = [mockStockAapl, mockStockMsft];

class MockStockModel implements Partial<StockModel> {
	findOne(filter?: FilterQuery<IStockDocument>): any {
		const stock = stockArr.filter((e) => e.ticker === filter.ticker)[0];
		return Promise.resolve(stock);
	}

	find(filter?: FilterQuery<IStockDocument>): any {
		return Promise.resolve(stockArr);
	}

	// ! HOW TO MOCK THIS FUCKING THING?!
	aggregate(): any {
		return {
			exec: () => {
				// const stock = stockArr.filter((e) => e.ticker === filter.ticker)[0];
				return Promise.resolve(mockStockAapl);
			},
		};
	}
}

describe('StocksService', () => {
	let service: StocksService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StocksService,
				{
					provide: getModelToken(Stock.name),
					useClass: MockStockModel,
				},
			],
		}).compile();

		service = module.get<StocksService>(StocksService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get all availableTickers', async () => {
		const tickers = await service.availableTickers();
		expect(tickers).toContain('1234');
		expect(tickers).toContain('5678');
	});

	it('should get stock', async () => {
		const stock = await service.get({ ticker: 'AAPL', limit: 0, sort: 'asc' });
		expect(stock._id).toEqual('1234');
		expect(stock.ticker).toEqual('AAPL');
	});

	it('should get error if the stock is not found', async () => {
		await expect(
			service.get({
				ticker: 'FUCKTHESTOCKS',
				limit: 0,
				sort: 'asc',
			}),
		).rejects.toBeInstanceOf(NotFoundException);
	});
});
