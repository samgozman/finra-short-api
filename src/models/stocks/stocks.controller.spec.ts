import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { User } from '../users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('StocksController', () => {
	let controller: StocksController;

	const mockStock = {
		ticker: 'AAPL',
	};

	class MockStocksService {
		get() {
			return Promise.resolve(mockStock);
		}
	}

	const mockUser = {};
	const mockUsersService = {};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StocksController],
			providers: [
				{
					provide: getModelToken(User.name),
					useValue: mockUser,
				},
				{
					provide: StocksService,
					useClass: MockStocksService,
				},
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		}).compile();

		controller = module.get<StocksController>(StocksController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should get stock', async () => {
		const stock = await controller.getStock({
			ticker: 'AAPL',
			limit: 0,
			sort: 'asc',
		});
		expect(stock).toEqual(mockStock);
	});
});
