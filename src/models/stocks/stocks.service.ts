import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AnyKeys, AnyObject, FilterQuery, Types } from 'mongoose';
import { GetStockDto } from './dtos/get-stock.dto';
import { StocksRepository } from './repositories/stocks.repository';
import {
	IStock,
	IStockDocument,
	SortDirs,
	StockKeys,
} from './schemas/stock.schema';

@Injectable()
export class StocksService {
	private readonly logger = new Logger(StocksService.name);
	constructor(private readonly stocksRepository: StocksRepository) {}

	/** Name of the Stock collection */
	readonly collectionName = this.stocksRepository.name;
	/** Counts the number of documents in the collection. */
	readonly collectionDocsCount = this.stocksRepository.estimatedDocumentCount();

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
	createNewInstance(doc?: AnyKeys<IStockDocument> & AnyObject): IStockDocument {
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
	 * @returns IStockDocument
	 */
	async findById(id: any) {
		return this.stocksRepository.findById(id);
	}

	/**
	 * Get all stocks by query
	 * @param limit
	 * @param skip
	 * @param sortby
	 * @param sortdir
	 * @returns array of stocks
	 */
	async getAllStocks(
		limit: number,
		skip: number,
		sortby: StockKeys,
		sortdir: SortDirs,
	): Promise<IStock[]> {
		return this.stocksRepository.getAllStocks(limit, skip, sortby, sortdir);
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
