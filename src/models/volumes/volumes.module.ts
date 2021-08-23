import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VolumeModel } from './schemas/volume.schema';
import { VolumesService } from './volumes.service';

@Module({
	providers: [VolumesService],
	imports: [MongooseModule.forFeature([VolumeModel])],
	exports: [VolumesService],
})
export class VolumesModule {}
