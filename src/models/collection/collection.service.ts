import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStockDocument, Stock } from '../stocks/schemas/stock.schema';
import {
	FinraAssignedReports,
	IFinraMongo,
	IVolumeDocument,
	Volume,
} from '../volumes/schemas/volume.schema';
import { ParseService } from './parse.service';

// ! Setup nest logger

@Injectable()
export class CollectionService {
	constructor(
		private parseService: ParseService,
		@InjectModel(Stock.name)
		private readonly stockModel: Model<IStockDocument>,
		@InjectModel(Volume.name)
		private readonly volumeModel: Model<IVolumeDocument>,
	) {}

	// ex processLines
	async uploadFinraReports(
		reports: FinraAssignedReports,
	): Promise<IFinraMongo[]> {
		let mongoArr: IFinraMongo[] = [];
		for (const report in reports) {
			// ! Push Stock related strings to the StocksService
			// Try to find existing
			let stock: IStockDocument | null = await this.stockModel.findOne({
				ticker: report,
			});

			// If not - create
			if (!stock) {
				stock = new this.stockModel({
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
	}

	async updateLastTradingDay(): Promise<void> {
		try {
			const files = await this.parseService.getLinksToFiles(
				'http://regsho.finra.org/regsho-Index.html',
			);
			const { [Object.keys(files).pop() as string]: currentDay } = files;
			const reports = await this.parseService.getDataFromFile(currentDay);
			let mongoArr = await this.uploadFinraReports(reports);
			await this.volumeModel.insertMany(mongoArr);
		} catch (error) {
			console.error('Error in updateLastTradingDay: ' + error);
		}
	}

	/** Creates db from the start */
	async recreateFullDatabase() {
		try {
			const pages = await this.parseService.getMonthlyPages();
			const files = [];

			// Get links to reports
			for (const page in pages) {
				const links = await this.parseService.getLinksToFiles(pages[page]);
				files.push(...Object.values(links));
			}

			// Process files
			for (const file in files) {
				const reports = await this.parseService.getDataFromFile(files[file]);
				let mongoArr = await this.uploadFinraReports(reports);
				await this.volumeModel.insertMany(mongoArr);
			}
		} catch (error) {
			console.log('recreateFullDatabase:', error);
		}
	}
}
