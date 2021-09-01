import { InternalServerErrorException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { IVolumeDocument, Volume } from './schemas/volume.schema';
import { VolumesService } from './volumes.service';

const mockDate = new Date();
let volume = { date: mockDate } as IVolumeDocument;

class MockVolumeModel {
	findOne() {
		return this;
	}

	sort() {
		return volume;
	}
}

describe('VolumesService', () => {
	let service: VolumesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				VolumesService,
				{
					provide: getModelToken(Volume.name),
					useClass: MockVolumeModel,
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
