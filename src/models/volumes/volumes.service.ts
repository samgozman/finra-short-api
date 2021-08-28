import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Volume, VolumeModel } from './schemas/volume.schema';

@Injectable()
export class VolumesService {
	private readonly logger = new Logger(VolumesService.name);
	constructor(
		@InjectModel(Volume.name)
		private readonly volumeModel: VolumeModel,
	) {}

	/**
	 * Get number (ms) of the last trading day
	 * @returns
	 */
	async lastDateTime(): Promise<number> {
		try {
			const lastDate = (await this.volumeModel
				.findOne()
				.sort({ date: -1 }))!.date.getTime();
			return lastDate;
		} catch (error) {
			this.logger.error(`Error in ${this.lastDateTime.name}`, error);
			throw new InternalServerErrorException();
		}
	}
}
