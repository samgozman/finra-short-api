import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AnyKeys, AnyObject, FilterQuery, Types } from 'mongoose';
import { FilteredStocksDto } from '../filters/dtos/filtered-stocks.dto';
import { GetFilteredStocksDto } from '../filters/dtos/get-filtered-stocks.dto';
import { GetStockDto } from './dtos/get-stock.dto';
import { StocksRepository } from './repositories/stocks.repository';
import { IStockDocument } from './schemas/stock.schema';

@Injectable()
export class StocksService {
	private readonly logger = new Logger(StocksService.name);
	constructor(private readonly stocksRepository: StocksRepository) {}

	/**
	 * Get array of all available stocks id's
	 * @async
	 * @returns Promise array of stocks ObjectId's
	 */
	async availableTickers(): Promise<Types.ObjectId[]> {
		const stocks = await this.stocksRepository.find({});
		return stocks.map((a) => a._id);
	}

	/** Create new Stock instance */
	createNewInstance(doc?: AnyKeys<IStockDocument> & AnyObject) {
		return this.stocksRepository.new(doc);
	}

	/**
	 * Creates a find query: gets a list of Stock documents that match `filter`.
	 * @param filter
	 * @returns
	 */
	async findMany(filter: FilterQuery<IStockDocument>) {
		return this.stocksRepository.find(filter);
	}

	/**
	 * Finds one Stock document.
	 * @param filter
	 * @returns
	 */
	async findOne(filter: FilterQuery<IStockDocument>) {
		return this.stocksRepository.findOne(filter);
	}

	/**
	 * Finds a single Stock document by its _id field.
	 * @param id
	 * @returns
	 */
	async findById(id: any) {
		return this.stocksRepository.findById(id);
	}

	/**
	 * Get all stocks by query
	 * @param query
	 * @returns array of stocks
	 */
	async getAllStocks(query: GetFilteredStocksDto): Promise<FilteredStocksDto> {
		const { limit, skip, sortby, sortdir, tickers } = query;
		return this.stocksRepository.getAllStocks(
			limit,
			skip,
			sortby,
			sortdir,
			tickers,
		);
	}

	/**
	 * Get stock
	 * @param query GetStockDto
	 */
	async get(query: GetStockDto) {
		try {
			const { ticker, limit, sort } = query;
			const stock = await this.stocksRepository.getStockWithVolume(
				{ ticker },
				limit,
				sort,
			);

			if (!stock) {
				throw new Error();
			}

			return {
				...stock,
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
