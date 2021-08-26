import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Tinkoff } from 'tinkoff-api-securities';
import { VolumesService } from 'src/models/volumes/volumes.service';
import { Stock, StockModel } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import {
	Filter,
	FilterModel,
	IFilterDocument,
	IFiltersList,
} from './schemas/filter.schema';

export interface ISort {
	field: keyof Stock;
	dir: 'asc' | 'desc';
}

export interface IFiltredStocks {
	count: number;
	stocks: Stock[];
}

/** Filter keys */
export type Filters = keyof IFiltersList & string;

@Injectable()
export class FilterUnitService {
	private readonly logger = new Logger(FilterUnitService.name);
	constructor(
		@InjectModel(Filter.name)
		private readonly filterModel: FilterModel,
		@InjectModel(Stock.name)
		private readonly stockModel: StockModel,
		private readonly stocksService: StocksService,
		private readonly configService: ConfigService,
		private readonly volumesService: VolumesService,
	) {}

	/**
	 * Create empty DB record for each stock
	 */
	async createEmptyFilters() {
		try {
			// Drop collection before recreation
			await this.filterModel.collection.drop().catch(() => {
				this.logger.log('Filter collection do not exist yet.');
			});

			const allIds = await this.stocksService.avalibleTickers();
			for (const _id of allIds) {
				await new this.filterModel({ _stock_id: _id }).save();
			}
		} catch (error) {
			this.logger.error(`Error in ${this.createEmptyFilters.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	/**
	 * Function to update any filter
	 * @param _stock_id Mongo ID of parent instacne from db.stocks
	 * @param key Filtering key name
	 * @param value Filtering value (true or false)
	 */
	private async updateFilter(
		_stock_id: Types.ObjectId,
		key: Filters,
		value: boolean = true,
	) {
		try {
			// Find filter for _stock_id
			const filter = await this.filterModel.findOne({ _stock_id });
			if (filter) {
				// If it is existing - update
				await filter.updateOne({
					[key]: value,
				});
			} else {
				// If not - create
				const newFilter = new this.filterModel({
					_stock_id,
					[key]: value,
				});

				await newFilter.save();
			}
		} catch (error) {
			this.logger.error(`Error in ${this.updateFilter.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	/**
	 * Get an array of Stocks ObjectId's matching the filtering condition's.
	 * @param keys Filtering key names array. Multiple names to create union
	 * @param limit Optional. Limit stocks per request
	 * @param skip Optional. Number of stocks to skip
	 * @returns Promise array of Stocks
	 */
	async getFilter(
		keys: Filters[],
		limit: number,
		skip: number,
		sort: ISort,
	): Promise<IFiltredStocks> {
		try {
			// Convert filter keys to object like {key: true, ...}
			const keyPairs = keys.reduce((ac, a) => ({ ...ac, [a]: true }), {});
			const count: number = await this.filterModel.countDocuments(keyPairs);

			interface Aggregation extends IFilterDocument {
				stock: Stock[];
			}

			const aggregation = (await this.filterModel
				.aggregate([
					// 1 stage: find matches
					{ $match: keyPairs },
					// 2 stage: lookup for their filters
					// ! this.stockModel => Stock.name
					{
						$lookup: {
							from: this.stockModel.collection.name,
							localField: '_stock_id',
							foreignField: '_id',
							as: 'stock',
						},
					},
					// 3 stage: sort and paginate aggregated data
					{ $sort: { [`stock.${sort.field}`]: sort.dir === 'asc' ? 1 : -1 } },
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

			return { count, stocks: sortedStocks };
		} catch (error) {
			this.logger.error(`Error in ${this.getFilter.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	// *** UNITS *** //

	isNotGarbageFilter(filter: Filters = 'isNotGarbage'): () => Promise<void> {
		try {
			return async () => {
				const allIds = await this.stocksService.avalibleTickers();
				const lastDay = await this.volumesService.lastDateTime();

				for (const _id of allIds) {
					const stock = (await this.stockModel.findById(_id))!;
					const volume = (await stock.getVirtual('volume', 5, 'desc')).volume;
					// Checks
					const volumeIsAtLeast5 = volume.length === 5;
					if (volumeIsAtLeast5 && lastDay === volume[0].date.getTime()) {
						const total_isNotZero = volume.every(
							(item) => item.totalVolume !== 0,
						);
						const averageIsAboveMinimum =
							volume.reduce((p, c) => p + c.totalVolume, 0) / volume.length >=
							5000;
						if (total_isNotZero && averageIsAboveMinimum) {
							await this.updateFilter(_id, filter, true);
						}
					}
				}
			};
		} catch (error) {
			this.logger.error(`Error in ${this.isNotGarbageFilter.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	tinkoffFilter(filter: Filters = 'onTinkoff'): () => Promise<void> {
		try {
			return async () => {
				const tinkoff = new Tinkoff(this.configService.get('SANDBOX_TOKEN'));
				const onTinkoff = await tinkoff.stocks('USD');
				for (const tink of onTinkoff) {
					// Find Stock
					const { ticker } = tink;
					const stock = await this.stockModel.findOne({ ticker });
					// Get ID
					const _stock_id: Types.ObjectId = stock?.id;
					// Create record
					if (_stock_id) {
						await this.updateFilter(_stock_id, filter, true);
					}
				}
			};
		} catch (error) {
			this.logger.error(`Error in ${this.tinkoffFilter.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	volumeFilter(
		filter: Filters,
		volType: 'shortVolume' | 'shortExemptVolume' | 'totalVolume',
		momentum: 'growing' | 'decreasing',
		period: number = 5,
		ratio: boolean = false,
	): () => Promise<void> {
		try {
			return async () => {
				const allIds = await this.stocksService.avalibleTickers();
				for (const _id of allIds) {
					const stock = (await this.stockModel.findById(_id))!;
					const volume = (await stock.getVirtual('volume', period + 1, 'desc'))
						.volume;

					// Check if populated volume exists
					if (volume && volume.length > 1) {
						const volArr = ratio
							? volume.map((e) => e[volType] / e.totalVolume).reverse()
							: volume.map((e) => e[volType]).reverse();
						// Validate each value is greater / lesser than previous
						const validation: boolean[] =
							momentum === 'growing'
								? volArr.map((e, i: number) => volArr[i] > volArr[i - 1])
								: volArr.map((e, i: number) => volArr[i] < volArr[i - 1]);
						// Remove first element of the array (it was used for comparing only)
						validation.shift();
						// If all validations in row are true
						const checker = validation.every((v) => v === true);
						await this.updateFilter(_id, filter, checker);
					}
				}
			};
		} catch (error) {
			this.logger.error(`Error in ${this.volumeFilter.name}`, error);
			throw new InternalServerErrorException();
		}
	}
}
