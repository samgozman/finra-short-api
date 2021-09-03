import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery } from 'mongoose';
import { Volume, VolumeModel } from 'src/models/volumes/schemas/volume.schema';
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
	constructor(
		@InjectModel(Stock.name)
		private readonly stockModel: StockModel,

		@InjectModel(Volume.name)
		private readonly volumeModel: VolumeModel,
	) {}

	/** Create new Stock instance */
	new = (doc?: AnyKeys<IStockDocument> & AnyObject) => new this.stockModel(doc);

	/** Counts the number of documents in the collection. */
	estimatedDocumentCount = () => this.stockModel.estimatedDocumentCount();

	/**
	 * Creates a find query: gets a list of Stock documents that match `filter`.
	 * @param filter
	 * @returns
	 */
	async find(filter: FilterQuery<IStockDocument>) {
		return this.stockModel.find(filter);
	}

	/**
	 * Finds one Stock document.
	 * @param filter
	 * @returns
	 */
	async findOne(filter?: FilterQuery<IStockDocument>) {
		return this.stockModel.findOne(filter);
	}

	/**
	 * Finds a single Stock document by its _id field.
	 * @param id
	 * @returns IStockDocument
	 */
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
						from: this.volumeModel.collection.name,
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
	) {
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
