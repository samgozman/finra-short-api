import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, IStockDocument } from './schemas/stock.schema';

@Injectable()
export class StocksService {
	constructor(
		@InjectModel(Stock.name)
		private readonly stockModel: Model<IStockDocument>,
	) {}
}
