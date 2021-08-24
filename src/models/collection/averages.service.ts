import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stock, StockModel } from '../stocks/schemas/stock.schema';
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
	constructor(
		@InjectModel(Stock.name)
		private readonly stockModel: StockModel,
		private volumesService: VolumesService,
		private stocksService: StocksService,
	) {}

	async averages() {
		try {
			// ! Get method from `stockModel`
			const allIds = await this.stocksService.avalibleTickers();
			const latestDate = await this.volumesService.lastDateTime();

			for (const _id of allIds) {
				const stock = (await this.stockModel.findById(_id))!;
				const volume = (await stock.getVirtual('volume', 20, 'desc')).volume;

				// Check that the volume array is exists and stock was traded during last day
				if (
					volume &&
					volume.length > 1 &&
					volume[0].date.getTime() === latestDate
				) {
					// last day (copy just to be able to sort faster without population)
					stock.totalVolLast = volume[0].totalVolume;
					stock.shortVolRatioLast =
						(volume[0].shortVolume / volume[0].totalVolume) * 100;
					stock.shortExemptVolRatioLast =
						(volume[0].shortExemptVolume / volume[0].totalVolume) * 100;

					// 5 days
					const vol5 = volume.slice(0, 5);
					stock.totalVol5DAVG = avgVol(vol5, 'totalVolume');
					stock.shortVolRatio5DAVG =
						(avgVol(vol5, 'shortVolume') / stock.totalVol5DAVG) * 100;
					stock.shortExemptVolRatio5DAVG =
						(avgVol(vol5, 'shortExemptVolume') / stock.totalVol5DAVG) * 100;

					// 20 days
					stock.totalVol20DAVG = avgVol(volume, 'totalVolume');
					stock.shortVolRatio20DAVG =
						(avgVol(volume, 'shortVolume') / stock.totalVol20DAVG) * 100;
					stock.shortExemptVolRatio20DAVG =
						(avgVol(volume, 'shortExemptVolume') / stock.totalVol20DAVG) * 100;
				} else {
					// Clear statistics
					stock.totalVolLast = 0;
					stock.shortVolRatioLast = 0;
					stock.shortExemptVolRatioLast = 0;
					stock.totalVol5DAVG = 0;
					stock.shortVolRatio5DAVG = 0;
					stock.shortExemptVolRatio5DAVG = 0;
					stock.totalVol20DAVG = 0;
					stock.shortVolRatio20DAVG = 0;
					stock.shortExemptVolRatio20DAVG = 0;
				}
				await stock.save();
			}
		} catch (error) {
			console.error('Error in averages: ' + error);
		}
	}
}
