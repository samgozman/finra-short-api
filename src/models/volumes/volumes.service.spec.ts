import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VolumesRepository } from './repositories/volumes.repository';
import { IVolumeDocument } from './schemas/volume.schema';
import { VolumesService } from './volumes.service';

const mockDate = new Date();
let volume = { date: mockDate } as IVolumeDocument;

class MockVolumesRepository {
	findOne() {
		return Promise.resolve(volume);
	}
}

describe('VolumesService', () => {
	let service: VolumesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				VolumesService,
				{
					provide: VolumesRepository,
					useClass: MockVolumesRepository,
				},
			],
		}).compile();

		service = module.get<VolumesService>(VolumesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('lastDateTime: should get last day as number', async () => {
		const date = await service.lastDateTime();
		expect(date).toEqual(mockDate.getTime());
	});

	it('lastDateTime: should get error if volume is undefined', async () => {
		volume = undefined;
		await expect(service.lastDateTime()).rejects.toBeInstanceOf(
			InternalServerErrorException,
		);
	});
});
