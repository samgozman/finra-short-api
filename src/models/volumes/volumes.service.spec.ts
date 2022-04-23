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

});
