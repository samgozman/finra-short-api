import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { GetStockDto } from './dtos/get-stock.dto';
import { StockDto } from './dtos/stock.dto';
import { Stock, StockModel } from './schemas/stock.schema';

@Injectable()
export class StocksService {
	private readonly logger = new Logger(StocksService.name);
	constructor(
		@InjectModel(Stock.name)
		private readonly stockModel: StockModel,
	) {}

	/**
	 * Get array of all available stocks id's
	 * @async
	 * @returns Promise array of stocks ObjectId's
	 */
	async availableTickers(): Promise<Types.ObjectId[]> {
		const stocks = await this.stockModel.find({});
		return stocks.map((a) => a._id);
	}

	/**
	 * Get stock
	 * @param query GetStockDto
	 */
	async get(query: GetStockDto) {
		try {
			const stock = (await this.stockModel
				.aggregate<StockDto>([
					{ $match: { ticker: query.ticker } },
					{ $limit: 1 },
					{
						$lookup: {
							from: 'volumes',
							let: { id: '$_id' },
							pipeline: [
								{ $match: { $expr: { $eq: ['$$id', '$_stock_id'] } } },
								{ $sort: { date: query.sort === 'asc' ? 1 : -1 } },
								{ $limit: query.limit },
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

			return {
				...stock[0],
				version: process.env.npm_package_version,
			};
		} catch (error) {
			if (error.message) {
				this.logger.error(`Error in ${this.get.name}`, error);
			}
			throw new NotFoundException(`Stock ${query.ticker} is not found!`);
		}
	}
}
