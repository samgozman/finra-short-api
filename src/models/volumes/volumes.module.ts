import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VolumeModelDefinition } from './schemas/volume.schema';
import { VolumesService } from './volumes.service';

@Module({
	providers: [VolumesService],
	imports: [MongooseModule.forFeature([VolumeModelDefinition])],
	exports: [VolumesService],
})
export class VolumesModule {}
