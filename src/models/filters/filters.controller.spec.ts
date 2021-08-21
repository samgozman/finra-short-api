import { Test, TestingModule } from '@nestjs/testing';
import { FiltersController } from './filters.controller';

describe('FiltersController', () => {
	let controller: FiltersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FiltersController],
		}).compile();

		controller = module.get<FiltersController>(FiltersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
