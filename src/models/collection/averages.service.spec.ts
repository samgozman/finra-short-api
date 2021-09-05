import { Test } from '@nestjs/testing';
import { IStockDocument } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { VolumesRepository } from '../volumes/repositories/volumes.repository';
import { IVolumeDocument } from '../volumes/schemas/volume.schema';
import { VolumesService } from '../volumes/volumes.service';
import { AveragesService } from './averages.service';

const mockStockDoc = {
	_id: 'id1',
	ticker: 'AAPL',

	save: () => Promise.resolve(undefined),
} as IStockDocument;

const latestDate = new Date();

let mockIdsArr = ['id1', 'id2'];
let mockVolumeDocs = [] as IVolumeDocument[];

describe('AveragesService', () => {
	let averagesService: AveragesService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [],
			controllers: [],
			providers: [
				{ provide: VolumesRepository, useValue: {} },
				{
					provide: StocksService,
					useValue: {
						findById: (id: string) => {
							return Promise.resolve(mockStockDoc);
						},
						availableTickers: () => Promise.resolve(mockIdsArr),
					},
				},
				{
					provide: VolumesService,
					useValue: {
						lastDateTime: () => Promise.resolve(latestDate.getTime()),
						findMany: () => Promise.resolve(),
					},
				},
				AveragesService,
			],
		}).compile();

		averagesService = moduleRef.get<AveragesService>(AveragesService);
	});

	it('should be defined', () => {
		expect(averagesService).toBeDefined();
	});

	it('averages: should run without errors if volume is empty', async () => {
		await expect(averagesService.averages()).resolves.toEqual(undefined);
	});

	it('averages: should run without errors with full volume', async () => {
		mockVolumeDocs = [
			{
				date: latestDate,
				totalVolume: 5000,
				shortVolume: 3000,
				shortExemptVolume: 200,
			},
			{
				date: latestDate,
				totalVolume: 4000,
				shortVolume: 2500,
				shortExemptVolume: 150,
			},
		] as IVolumeDocument[];

		await expect(averagesService.averages()).resolves.toEqual(undefined);
	});
});
