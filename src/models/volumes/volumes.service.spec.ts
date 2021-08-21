import { Test, TestingModule } from '@nestjs/testing';
import { VolumesService } from './volumes.service';

describe('VolumesService', () => {
	let service: VolumesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [VolumesService],
		}).compile();

		service = module.get<VolumesService>(VolumesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
