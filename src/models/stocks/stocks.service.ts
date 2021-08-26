import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { GetStockDto } from './dtos/get-stock.dto';
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
	async avalibleTickers(): Promise<Types.ObjectId[]> {
		const stocks = await this.stockModel.find({});
		return stocks.map((a) => a._id);
	}

	/**
	 * Get stock
	 * @param query GetStockDto
	 */
	async get(query: GetStockDto) {
		try {
			let stock = await this.stockModel.findOne({ ticker: query.ticker });

			if (!stock) {
				throw new Error();
			}

			// Populate volumes
			await stock
				.populate({
					path: 'volume',
					options: {
						limit: query.limit,
						sort: {
							date: query.sort,
						},
					},
					select:
						'-_id -_stock_id totalVolume shortExemptVolume shortVolume date',
				})
				.execPopulate();

			return {
				...stock.toJSON(),
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
