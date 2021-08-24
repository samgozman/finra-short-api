import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Stock, StockModel } from './schemas/stock.schema';

@Injectable()
export class StocksService {
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
}
