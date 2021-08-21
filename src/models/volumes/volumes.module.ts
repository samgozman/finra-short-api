import { Module } from '@nestjs/common';
import { VolumesService } from './volumes.service';

@Module({
	providers: [VolumesService],
})
export class VolumesModule {}
