import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	AnyObject,
	FilterQuery,
	InsertManyOptions,
	QueryOptions,
} from 'mongoose';
import { IVolumeDocument, Volume, VolumeModel } from '../schemas/volume.schema';

@Injectable()
export class VolumesRepository {
	constructor(
		@InjectModel(Volume.name)
		private readonly volumeModel: VolumeModel,
	) {}

	/**
	 * Find one Volume object
	 * @param filter search options
	 * @param projection
	 * @param options
	 * @returns Filter object
	 */
	async findOne(
		filter?: FilterQuery<IVolumeDocument>,
		projection?: any | null,
		options?: QueryOptions | null,
	) {
		return this.volumeModel.findOne(filter, projection, options);
	}

	async insertMany(
		docs: (IVolumeDocument | AnyObject)[],
		options?: InsertManyOptions,
	) {
		return this.volumeModel.insertMany(docs, options);
	}
}
