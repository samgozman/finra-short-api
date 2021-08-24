import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Volume, VolumeModel } from './schemas/volume.schema';

@Injectable()
export class VolumesService {
	constructor(
		@InjectModel(Volume.name)
		private readonly volumeModel: VolumeModel,
	) {}

	/**
	 * Get number (ms) of the last trading day
	 * @returns
	 */
	async lastDateTime(): Promise<number> {
		return (await this.volumeModel
			.findOne()
			.sort({ date: -1 }))!.date.getTime();
	}
}
