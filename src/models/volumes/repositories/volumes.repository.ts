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
	/** Name of the Volume collection */
	readonly name = this.volumeModel.collection.name;

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

	/**
	 * Find an array of Volume with math options
	 * @param match match option object
	 * @param sort sorting keys object (key: direction)
	 * @param limit
	 * @returns
	 */
	async findMany(match: {}, sort: {}, limit: number) {
		return this.volumeModel.aggregate<IVolumeDocument>([
			{ $match: match },
			{ $sort: sort },
			{ $limit: limit },
		]);
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
		return this.volumeModel.insertMany(docs, options);
	}
}
