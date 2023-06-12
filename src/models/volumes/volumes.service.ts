import { Injectable } from '@nestjs/common';
import { AnyObject, InsertManyOptions } from 'mongoose';
import { VolumesRepository } from './repositories/volumes.repository';
import { IVolumeDocument } from './schemas/volume.schema';

@Injectable()
export class VolumesService {
	constructor(private readonly volumesRepository: VolumesRepository) {}

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
