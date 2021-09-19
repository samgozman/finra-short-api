import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Stock } from '../stocks/schemas/stock.schema';
import { UsersRepository } from '../users/repositories/users.repository';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { FilteredStocksDto } from './dtos/filtered-stocks.dto';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

const mockFilterStocks: Partial<FilteredStocksDto> = {
	count: 2,
	stocks: [
		{
			ticker: 'AAPL',
		} as Stock,
		{
			ticker: 'MSFT',
		} as Stock,
	],
};

class MockFiltersService implements Partial<FiltersService> {
	get = (any) => Promise.resolve(mockFilterStocks) as any;
}

describe('FiltersController', () => {
	let filtersController: FiltersController;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [],
			controllers: [],
			providers: [
				UsersService,
				{
					provide: getModelToken(User.name),
					useClass: class MockUserModel {},
				},
				UsersRepository,
				FiltersController,
				{
					provide: FiltersService,
					useClass: MockFiltersService,
				},
			],
		}).compile();

		filtersController = moduleRef.get<FiltersController>(FiltersController);
	});

	it('should be defined', () => {
		expect(filtersController).toBeDefined();
	});

	it('should get filtered stocks with count', async () => {
		await expect(
			filtersController.getFilter({
				limit: 25,
				skip: 0,
				sortby: 'ticker',
				sortdir: 'desc',
			}),
		).resolves.toEqual(mockFilterStocks);
	});
});
