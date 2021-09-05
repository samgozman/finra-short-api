import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery } from 'mongoose';
import { Volume, VolumeModel } from 'src/models/volumes/schemas/volume.schema';
import { VolumesService } from 'src/models/volumes/volumes.service';
import { StockDto } from '../dtos/stock.dto';
import {
	IStock,
	IStockDocument,
	SortDirs,
	Stock,
	StockKeys,
	StockModel,
} from '../schemas/stock.schema';

@Injectable()
export class StocksRepository {
	private readonly logger = new Logger(StocksRepository.name);

	readonly name = this.stockModel.collection.name;

	constructor(
		@InjectModel(Stock.name)
		private readonly stockModel: StockModel,
		private readonly volumesService: VolumesService,
	) {}

	new = (doc?: AnyKeys<IStockDocument> & AnyObject) => new this.stockModel(doc);

	estimatedDocumentCount = () => this.stockModel.estimatedDocumentCount();

	async find(filter: FilterQuery<IStockDocument>) {
		return this.stockModel.find(filter);
	}

	async findOne(filter?: FilterQuery<IStockDocument>) {
		return this.stockModel.findOne(filter);
	}

	async findById(id: any) {
		return this.stockModel.findById(id);
	}

	/**
	 * Get stock with aggregated volume
	 * @param match {ticker: 'AAPL'}
	 * @param limit
	 * @param sort
	 * @returns
	 */
	async getStockWithVolume(match: {}, limit: number, sort: string) {
		const stock = (await this.stockModel
			.aggregate<StockDto>([
				{ $match: match },
				{ $limit: 1 },
				{
					$lookup: {
						from: this.volumesService.collectionName,
						let: { id: '$_id' },
						pipeline: [
							{ $match: { $expr: { $eq: ['$$id', '$_stock_id'] } } },
							{ $sort: { date: sort === 'asc' ? 1 : -1 } },
							{ $limit: limit },
						],
						as: 'volume',
					},
				},
				{
					$project: {
						_id: false,
						__v: false,
						volume: { _id: false, _stock_id: false, __v: false },
					},
				},
			])
			.exec()) as StockDto[];

		if (!stock || stock.length === 0) {
			throw new Error();
		}

		return stock[0];
	}

	async getAllStocks(
		limit: number,
		skip: number,
		sortby: StockKeys,
		sortdir: SortDirs,
	): Promise<IStock[]> {
		return this.stockModel.aggregate<IStock>([
			{ $match: {} },
			{
				$sort: {
					[sortby]: sortdir === 'asc' ? 1 : -1,
				},
			},
			{ $limit: skip + limit },
			{ $skip: skip },
			{ $project: { _id: false, _stock_id: false, __v: false } },
		]);
	}
}
