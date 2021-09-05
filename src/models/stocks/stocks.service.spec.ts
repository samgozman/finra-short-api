import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { StockDto } from './dtos/stock.dto';
import { StocksRepository } from './repositories/stocks.repository';
import { IStockDocument } from './schemas/stock.schema';
import { StocksService } from './stocks.service';

class MockStock {
	constructor(public _id: string, public ticker: string) {}
}

const mockStockAapl = new MockStock('1234', 'AAPL');
const mockStockMsft = new MockStock('5678', 'MSFT');
const stockArr = [mockStockAapl, mockStockMsft];

const mockStockDtoAapl: Partial<StockDto> = {
	ticker: 'AAPL',
	version: '2.0.0',
	volume: [],
};

class MockStocksRepository {
	findOne(filter?: FilterQuery<IStockDocument>): any {
		const stock = stockArr.filter((e) => e.ticker === filter.ticker)[0];
		return stock;
	}

	find(filter?: FilterQuery<IStockDocument>): any {
		return Promise.resolve(stockArr);
	}

	getStockWithVolume(match: any, limit: number, sort: string) {
		const stock = this.findOne({ ticker: match.ticker });
		if (stock) return Promise.resolve(mockStockDtoAapl);
	}
}

describe('StocksService', () => {
	let service: StocksService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StocksService,
				{
					provide: StocksRepository,
					useClass: MockStocksRepository,
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
