import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VolumesRepository } from './repositories/volumes.repository';
import { VolumeModelDefinition } from './schemas/volume.schema';
import { VolumesService } from './volumes.service';

@Module({
	providers: [VolumesService, VolumesRepository],
	imports: [MongooseModule.forFeature([VolumeModelDefinition])],
	exports: [VolumesService],
})
export class VolumesModule {}
