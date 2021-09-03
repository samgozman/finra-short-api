import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { GetStockDto } from './dtos/get-stock.dto';
import { StocksRepository } from './repositories/stocks.repository';

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
