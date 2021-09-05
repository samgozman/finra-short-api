import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery } from 'mongoose';
import { Stock } from '../../../models/stocks/schemas/stock.schema';
import { StocksService } from '../../../models/stocks/stocks.service';
import { ISort } from '../filter-unit.service';
import { Filter, FilterModel, IFilterDocument } from '../schemas/filter.schema';

@Injectable()
export class FiltersRepository {
	private readonly logger = new Logger(FiltersRepository.name);
	constructor(
		@InjectModel(Filter.name)
		private readonly filterModel: FilterModel,
		private readonly stocksService: StocksService,
	) {}

	/** Drop Filters collection */
	async dropCollection() {
		return this.filterModel.collection.drop().catch(() => {
			this.logger.log('Filter collection do not exist yet.');
		});
	}

	/**
	 * Create new instance of Filters object
	 * @param doc IFilterDocument keys
	 * @returns IFilterDocument object
	 */
	new(doc?: AnyKeys<IFilterDocument> & AnyObject) {
		return new this.filterModel(doc);
	}

	/**
	 * Find one Filter object
	 * @param filter search options
	 * @returns Filter object
	 */
	async findOne(filter?: FilterQuery<IFilterDocument>) {
		return this.filterModel.findOne(filter);
	}

	async countDocuments(filter: FilterQuery<IFilterDocument>) {
		return this.filterModel.countDocuments(filter);
	}

	/**
	 * Find stocks that matches the Filter
	 * @param match
	 * @param limit
	 * @param skip
	 * @param sort
	 * @returns
	 */
	async findStocksByFilteringCondition(
		match: {},
		limit: number,
		skip: number,
		sort: ISort,
	): Promise<Stock[]> {
		interface Aggregation extends IFilterDocument {
			stock: Stock[];
		}

		const aggregation = (await this.filterModel
			.aggregate([
				// 1 stage: find matches
				{ $match: match },
				// 2 stage: lookup for their filters
				// ! this.stockModel => Stock.name
				{
					$lookup: {
						from: this.stocksService.collectionName,
						localField: '_stock_id',
						foreignField: '_id',
						as: 'stock',
					},
				},
				// 3 stage: sort and paginate aggregated data
				{
					$sort: { [`stock.${sort.field}`]: sort.dir === 'asc' ? 1 : -1 },
				},
				{ $limit: skip + limit },
				{ $skip: skip },
				// 4 stage: hide unsafe keys from aggregation
				{
					$project: {
						stock: { _id: false, _stock_id: false, __v: false },
					},
				},
			])
			.exec()) as Aggregation[];

		// 5 stage: map array to get only stocks collection
		const sortedStocks: Stock[] = aggregation.map((e) => {
			return e.stock[0];
		});

		return sortedStocks;
	}
}
