import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery } from 'mongoose';
import { IStock } from 'src/models/stocks/schemas/stock.schema';
import { StocksService } from '../../../models/stocks/stocks.service';
import { FilteredStocksDto } from '../dtos/filtered-stocks.dto';
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
	 * Create array of blank filters
	 * @returns IFilterDocument array
	 */
	async createBlankFiltersArray() {
		const allIds = await this.stocksService.availableTickers();
		const filters: IFilterDocument[] = [];
		for (const _id of allIds) {
			filters.push(this.new({ _stock_id: _id }));
		}
		return filters;
	}

	/**
	 * Insert many filters in DB
	 * @param filters Array of IFilterDocument
	 * @returns
	 */
	insertMany(filters: IFilterDocument[]) {
		return this.filterModel.insertMany(filters);
	}

	/**
	 * Find one Filter object
	 * @param filter search options
	 * @returns Filter object
	 */
	async findOne(filter?: FilterQuery<IFilterDocument>) {
		return this.filterModel.findOne(filter);
	}

	/**
	 * Find stocks that matches the Filter
	 * @param match
	 * @param limit
	 * @param skip
	 * @param sort
	 * @param tickers limit query by specified tickers
	 * @returns
	 */
	async findStocksByFilteringCondition(
		match: {},
		limit: number,
		skip: number,
		sort: ISort,
		tickers: string[] = [],
	): Promise<FilteredStocksDto> {
		const pipeline = [
			// 1 stage: find matches
			{ $match: match },
			// 2 stage: lookup for their filters
			{
				$lookup: {
					from: this.stocksService.collectionName,
					let: { id: '$_stock_id' },
					pipeline: [
						{
							$match: {
								$and:
									tickers.length > 0
										? [
												// Match Stocks with _id as _stock_id from Filters
												{ $expr: { $eq: ['$_id', '$$id'] } },
												// Match only stocks from query (optional)
												{ $expr: { $in: ['$ticker', tickers] } },
										  ]
										: [{ $expr: { $eq: ['$_id', '$$id'] } }],
							},
						},
					],
					as: 'stock',
				},
			},
			// 3 stage - return only items with the stock found
			{
				$unwind: '$stock',
			},
		];

		// Count all elements separately.
		// ? Why? Because the $group does not support sorting and pagination.
		const { count } = (
			await this.filterModel.aggregate<{ count: number }>([
				...pipeline,
				{
					$count: 'count',
				},
			])
		)[0] || { count: 0 };

		const aggregation: { stock: IStock }[] = await this.filterModel
			.aggregate<{ stock: IStock }>([
				...pipeline,
				// 4 stage: sort and paginate aggregated data
				{
					$sort: { [`stock.${sort.field}`]: sort.dir === 'asc' ? 1 : -1 },
				},
				{ $limit: skip + limit },
				{ $skip: skip },
				// 5 stage: hide unsafe keys from aggregation
				{
					$project: {
						_id: false,
						stock: { _id: false, _stock_id: false, __v: false },
					},
				},
			])
			.exec();
		return { count, stocks: aggregation.map((e) => e.stock) };
	}
}
