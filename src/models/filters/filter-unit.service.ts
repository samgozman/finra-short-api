import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { Tinkoff } from 'tinkoff-api-securities';
import { VolumesService } from '../../models/volumes/volumes.service';
import { IStockDocument, Stock } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { FilteredStocksDto } from './dtos/filtered-stocks.dto';
import { FiltersRepository } from './repositories/filters.repository';
import { IFilterDocument, IFiltersList } from './schemas/filter.schema';

export interface ISort {
	field: keyof Stock;
	dir: 'asc' | 'desc';
}

/** Filter keys */
export type Filters = keyof IFiltersList & string;

type VolumeType = 'shortVolume' | 'shortExemptVolume' | 'totalVolume';
type VolumeShortType = 'shortVol' | 'shortExemptVol' | 'totalVol';

type Momentum = 'growing' | 'decreasing';

@Injectable()
export class FilterUnitService {
	private readonly logger = new Logger(FilterUnitService.name);
	private stocks: Promise<IStockDocument[]>;
	private filters: Promise<IFilterDocument[]>;

	constructor(
		private readonly stocksService: StocksService,
		private readonly configService: ConfigService,
		private readonly volumesService: VolumesService,
		private readonly filtersRepository: FiltersRepository,
	) {
		this.stocks = this.stocksService.findMany({});
		this.filters = this.filtersRepository.createBlankFiltersArray();
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
			this.filters.then((filters) => {
				// Find filter for _stock_id
				const id = filters.findIndex(
					(x) => String(x._stock_id) === String(_stock_id),
				);
				if (id >= 0) {
					// If it is existing - update
					filters[id][key] = value;

					// Update filters in class
					this.filters = Promise.resolve(filters);
				}
			});
		} catch (error) {
			this.logger.error(`Error in ${this.updateFilter.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	/**
	 * Save filters in DB
	 */
	async saveFilters() {
		try {
			this.filters.then(async (filters) => {
				// Drop old collection
				this.filtersRepository.dropCollection();

				// insert new collection
				await this.filtersRepository.insertMany(filters);
			});
		} catch (error) {
			this.logger.error(`Error in ${this.saveFilters.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	/**
	 * Get an array of stocks matching the filter + receive total count
	 * @param keys
	 * @param limit
	 * @param skip
	 * @param sort
	 * @returns
	 */
	async getFilter(
		keys: Filters[],
		limit: number,
		skip: number,
		sort: ISort,
	): Promise<FilteredStocksDto> {
		try {
			// Convert filter keys to object like {key: true, ...}
			const keyPairs = keys.reduce((ac, a) => ({ ...ac, [a]: true }), {});
			const count: number = await this.filtersRepository.countDocuments(
				keyPairs,
			);

			const stocks =
				await this.filtersRepository.findStocksByFilteringCondition(
					keyPairs,
					limit,
					skip,
					sort,
				);

			return { count, stocks };
		} catch (error) {
			this.logger.error(`Error in ${this.getFilter.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	// *** UNITS *** //

	isNotGarbageFilter(filter: Filters = 'isNotGarbage'): () => Promise<void> {
		try {
			return async () => {
				const lastDay = await this.volumesService.lastDateTime();
				const allIds = (await this.stocks).map((e) => e._id);

				for (const _id of allIds) {
					const volume = await this.volumesService.findMany(
						{ _stock_id: _id },
						{ date: -1 },
						5,
					);

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
				this.stocks.then(async (stocks) => {
					const tinkoff = new Tinkoff(this.configService.get('SANDBOX_TOKEN'));
					const onTinkoff = await tinkoff.stocks('USD');
					for (const tink of onTinkoff) {
						// Find Stock
						const { ticker } = tink;
						const stock = stocks.find((x) => x.ticker === ticker);
						// Get ID
						const _stock_id: Types.ObjectId = stock?.id;
						// Create record
						if (_stock_id) {
							await this.updateFilter(_stock_id, filter, true);
						}
					}
				});
			};
		} catch (error) {
			this.logger.error(`Error in ${this.tinkoffFilter.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	volumeFilter(
		filter: Filters,
		volType: VolumeType,
		momentum: Momentum,
		period: number = 5,
		ratio: boolean = false,
	): () => Promise<void> {
		try {
			return async () => {
				const allIds = (await this.stocks).map((e) => e._id);

				for (const _id of allIds) {
					const volume = await this.volumesService.findMany(
						{ _stock_id: _id },
						{ date: -1 },
						period,
					);

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

	// ! 1D AVG > 20D AVG
	// ! 3D AVG > 20D AVG
	// ! 5D AVG > 20D AVG
	/** Abnormal volume => more than triple the 20d average */
	abnormalVolumeFilter(
		filter: Filters,
		volType: VolumeShortType,
		momentum: Momentum,
	): () => Promise<void> {
		return async () => {
			try {
				// Get all stocks documents
				for (const stock of await this.stocks) {
					let multiplier: number;

					const average = stock[`${volType}20DAVG`];
					const currrent = stock[`${volType}Last`];

					if (momentum === 'growing') {
						multiplier = currrent / average;
					} else {
						multiplier = average / currrent;
					}

					// If difference between current volume and 20D AVG is greater than 3
					const value = multiplier >= 3 ? true : false;

					await this.updateFilter(stock._id, filter, value);
				}
			} catch (error) {
				this.logger.error(`Error in ${this.abnormalVolumeFilter.name}`, error);
				throw new InternalServerErrorException();
			}
		};
	}
}
