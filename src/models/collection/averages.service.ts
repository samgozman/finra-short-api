import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { IStock } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { FinraReport } from '../volumes/schemas/volume.schema';
import { VolumesService } from '../volumes/volumes.service';

// Calculate average volume
const avgVol = (
	arr: FinraReport[],
	key: keyof FinraReport & string,
): number => {
	let sum = 0;
	for (const i in arr) {
		sum += arr[i][key] as number;
	}
	return sum / arr.length;
};

@Injectable()
export class AveragesService {
	private readonly logger = new Logger(AveragesService.name);
	constructor(
		private volumesService: VolumesService,
		private stocksService: StocksService,
	) {}

	async averages() {
		try {
			this.logger.warn('Averages calculation procces has started');
			const allIds = await this.stocksService.availableTickers();
			const latestDate = await this.volumesService.lastDateTime();

			for (const _id of allIds) {
				const stock = (await this.stocksService.findById(_id))!;
				const volume = await this.volumesService.findMany(
					{
						_stock_id: _id,
					},
					{ date: -1 },
					20,
				);

				// Check that the volume array is exists and stock was traded during last day
				if (
					volume &&
					volume.length > 1 &&
					volume[0].date.getTime() === latestDate
				) {
					// last day (copy just to be able to sort faster without population)
					stock.totalVolLast = volume[0].totalVolume;
					stock.shortVolLast = volume[0].shortVolume;
					stock.shortExemptVolLast = volume[0].shortExemptVolume;
					stock.shortVolRatioLast =
						(volume[0].shortVolume / volume[0].totalVolume) * 100;
					stock.shortExemptVolRatioLast =
						(volume[0].shortExemptVolume / volume[0].totalVolume) * 100;

					// 5 days
					const vol5 = volume.slice(0, 5);
					stock.totalVol5DAVG = avgVol(vol5, 'totalVolume');
					stock.shortVol5DAVG = avgVol(vol5, 'shortVolume');
					stock.shortExemptVol5DAVG = avgVol(vol5, 'shortExemptVolume');
					stock.shortVolRatio5DAVG =
						(stock.shortVol5DAVG / stock.totalVol5DAVG) * 100;
					stock.shortExemptVolRatio5DAVG =
						(stock.shortExemptVol5DAVG / stock.totalVol5DAVG) * 100;

					// 20 days
					stock.totalVol20DAVG = avgVol(volume, 'totalVolume');
					stock.shortVol20DAVG = avgVol(volume, 'shortVolume');
					stock.shortExemptVol20DAVG = avgVol(volume, 'shortExemptVolume');
					stock.shortVolRatio20DAVG =
						(stock.shortVol20DAVG / stock.totalVol20DAVG) * 100;
					stock.shortExemptVolRatio20DAVG =
						(stock.shortExemptVol20DAVG / stock.totalVol20DAVG) * 100;
				} else {
					// Clear averages
					const zero_stock: IStock = {
						ticker: stock.ticker,
						// Percent values
						shortVolRatioLast: 0,
						shortExemptVolRatioLast: 0,
						shortVolRatio5DAVG: 0,
						shortExemptVolRatio5DAVG: 0,
						shortVolRatio20DAVG: 0,
						shortExemptVolRatio20DAVG: 0,
						// Numeric
						shortExemptVolLast: 0,
						shortExemptVol5DAVG: 0,
						shortExemptVol20DAVG: 0,
						shortVolLast: 0,
						shortVol5DAVG: 0,
						shortVol20DAVG: 0,
						totalVolLast: 0,
						totalVol5DAVG: 0,
						totalVol20DAVG: 0,
					};

					Object.assign(stock, zero_stock);
				}
				await stock.save();
			}
			this.logger.log('Averages calculation procces has finished');
		} catch (error) {
			this.logger.error(`Error in ${this.averages.name}`, error);
			throw new InternalServerErrorException();
		}
	}
}
