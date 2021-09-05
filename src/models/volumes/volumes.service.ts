import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { AnyObject, InsertManyOptions } from 'mongoose';
import { VolumesRepository } from './repositories/volumes.repository';
import { IVolumeDocument } from './schemas/volume.schema';

@Injectable()
export class VolumesService {
	private readonly logger = new Logger(VolumesService.name);
	constructor(private readonly volumesRepository: VolumesRepository) {}

	readonly collectionName = this.volumesRepository.name;

	/**
	 * Get number (ms) of the last trading day
	 * @returns
	 */
	async lastDateTime(): Promise<number> {
		try {
			const lastDate = (await this.volumesRepository.findOne({}, null, {
				sort: { date: -1 },
			}))!.date.getTime();
			return lastDate;
		} catch (error) {
			this.logger.error(`Error in ${this.lastDateTime.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	async findMany(match: {}, sort: {}, limit: number) {
		return this.volumesRepository.findMany(match, sort, limit);
	}

	async insertMany(
		docs: (IVolumeDocument | AnyObject)[],
		options?: InsertManyOptions,
	) {
		return this.volumesRepository.insertMany(docs, options);
	}
}
