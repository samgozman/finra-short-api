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

	readonly collectionName = this.stocksRepository.name;
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

	createNewInstance(doc?: AnyKeys<IStockDocument> & AnyObject): IStockDocument {
		return this.stocksRepository.new(doc);
	}

	async findMany(filter: FilterQuery<IStockDocument>) {
		return this.stocksRepository.find(filter);
	}

	async findOne(filter: FilterQuery<IStockDocument>) {
		return this.stocksRepository.findOne(filter);
	}

	async findById(id: any) {
		return this.stocksRepository.findById(id);
	}

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
