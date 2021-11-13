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

	/** Name of the Volume collection */
	readonly collectionName = this.volumesRepository.name;

	/**
	 * Get number (ms) of the last trading day
	 * @returns
	 */
	async lastDateTime(): Promise<number> {
		try {
			return (await this.volumesRepository.findOne({}, null, {
				sort: { date: -1 },
			}))!.date.getTime();
		} catch (error) {
			this.logger.error(`Error in ${this.lastDateTime.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	/**
	 * Find an array of Volume with math options
	 * @param match match option object
	 * @param sort sorting keys object (key: direction)
	 * @param limit
	 * @returns
	 */
	async findMany(match: {}, sort: {}, limit: number) {
		return this.volumesRepository.findMany(match, sort, limit);
	}

	/**
	 * Inserts one or more new Volume documents as a single insertMany call to the MongoDB server.
	 * @param docs
	 * @param options
	 * @returns
	 */
	async insertMany(
		docs: (IVolumeDocument | AnyObject)[],
		options?: InsertManyOptions,
	) {
		return this.volumesRepository.insertMany(docs, options);
	}
}
