import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { FiltersService } from '../filters/filters.service';
import { UsersRepository } from '../users/repositories/users.repository';
import { UsersService } from '../users/users.service';
import { AveragesService } from './averages.service';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

class MockCollectionService implements Partial<CollectionService> {
	recreateFullDatabase = () => Promise.resolve(undefined);
	updateLastTradingDays = () => Promise.resolve(undefined);
	updateVolumesByLink = () => Promise.resolve(undefined);
}

class MockAveragesService implements Partial<AveragesService> {
	averages = () => Promise.resolve(undefined);
}

class MockFiltersService implements Partial<FiltersService> {
	updateAll = () => Promise.resolve(undefined);
}

describe('CollectionController', () => {
	let collectionController: CollectionController;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
			controllers: [],
			providers: [
				UsersService,
				{
					provide: UsersRepository,
					useValue: {},
				},
				CollectionController,
				{
					provide: CollectionService,
					useClass: MockCollectionService,
				},
				{
					provide: AveragesService,
					useClass: MockAveragesService,
				},
				{
					provide: FiltersService,
					useClass: MockFiltersService,
				},
			],
		}).compile();

		collectionController =
			moduleRef.get<CollectionController>(CollectionController);
	});

	it('should be defined', () => {
		expect(collectionController).toBeDefined();
	});

	it('should run recreateCollection', async () => {
		await expect(
			collectionController.recreateCollection(),
		).resolves.toBeUndefined();
	});

	it('should run updateLastDay', async () => {
		await expect(collectionController.updateLastDay()).resolves.toBeUndefined();
	});

	it('should run updateFilters', async () => {
		await expect(collectionController.updateFilters()).resolves.toBeUndefined();
	});

	it('should run updateAverages', async () => {
		await expect(
			collectionController.updateAverages(),
		).resolves.toBeUndefined();
	});

	it('should run updateVolumesByLink', async () => {
		await expect(
			collectionController.updateVolumesByLink({ link: 'https://kek.com' }),
		).resolves.toBeUndefined();
	});

	it('should run updateLastDayWithFiltersAndAverages', async () => {
		await expect(
			collectionController.updateLastDayWithFiltersAndAverages(),
		).resolves.toBeUndefined();
	});
});
