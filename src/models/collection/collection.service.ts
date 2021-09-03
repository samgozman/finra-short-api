import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StocksRepository } from '../stocks/repositories/stocks.repository';
import { Stock, StockModel } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import {
	FinraAssignedReports,
	Volume,
	VolumeModel,
} from '../volumes/schemas/volume.schema';
import { ParseService } from './parse.service';

@Injectable()
export class CollectionService {
	private readonly logger = new Logger(CollectionService.name);
	constructor(
		private parseService: ParseService,
		private stocksService: StocksService,
		@InjectModel(Stock.name)
		private readonly stockModel: StockModel,
		@InjectModel(Volume.name)
		private readonly volumeModel: VolumeModel,
		private readonly stocksRepository: StocksRepository,
	) {}

	// ex processLines
	async createVolumeArray(reports: FinraAssignedReports): Promise<Volume[]> {
		try {
			if (Object.keys(reports).length === 0) {
				return [];
			}

			let mongoArr: Volume[] = [];
			for (const report in reports) {
				// Try to find existing
				let stock = await this.stockModel.findOne({
					ticker: report,
				});

				// If not - create
				if (!stock) {
					stock = this.stocksRepository.new({
						ticker: report,
					});
					await stock.save();
				}

				mongoArr.push({
					_stock_id: stock._id,
					...reports[report],
				});
			}

			return mongoArr;
		} catch (error) {
			this.logger.error(`Error in ${this.createVolumeArray.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	/**
	 * Recreate full database from the start.
	 * When using the `reversed` option, you can add the missing days to the already generated base.
	 * The script will stop at the first data duplication error.
	 * @param reversed bypass an array of files from the last element
	 */
	private async fillDataBase(reversed: boolean = false) {
		try {
			const files = reversed
				? this.parseService.getAllDaysPages().reverse()
				: this.parseService.getAllDaysPages();
			for (const file in files) {
				const reports = await this.parseService.getDataFromFile(files[file]);
				const mongoArr = await this.createVolumeArray(reports);
				await this.volumeModel.insertMany(mongoArr);
			}
		} catch (error) {
			if (error.code !== 11000) {
				this.logger.error(`Error in ${this.fillDataBase.name}`, error);
				throw new InternalServerErrorException();
			} else {
				this.logger.log(
					`${this.fillDataBase.name}: first duplication error. Data recording is stopped`,
				);
			}
		}
	}

	/** Update last trading days. */
	async updateLastTradingDays(): Promise<void> {
		try {
			this.logger.warn('Fetching last day data from FINRA has started');
			await this.fillDataBase(true);
			this.logger.log('Fetching last day data from FINRA has finished');
		} catch (error) {
			this.logger.error(`Error in ${this.updateLastTradingDays.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	/** Creates db from the start */
	async recreateFullDatabase() {
		try {
			this.logger.warn('CREATING DATABASE FROM THE START');
			await this.fillDataBase(false);
			this.logger.log('Database rebuilding completed');
		} catch (error) {
			this.logger.error(`Error in ${this.recreateFullDatabase.name}`, error);
			throw new InternalServerErrorException();
		}
	}

	async updateVolumesByLink(link: string) {
		try {
			const reports = await this.parseService.getDataFromFile(link);
			const mongoArr = await this.createVolumeArray(reports);
			await this.volumeModel.insertMany(mongoArr);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}
