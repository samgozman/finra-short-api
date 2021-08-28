import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Volume } from './schemas/volume.schema';
import { VolumesService } from './volumes.service';

class MockVolumeModel {}

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
});
