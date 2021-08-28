import { Expose } from 'class-transformer';
import { Volume } from '../../../models/volumes/schemas/volume.schema';
import { IStock } from '../schemas/stock.schema';

export class StockDto implements IStock {
	@Expose()
	ticker: string;

	@Expose()
	shortVolRatioLast: number;

	@Expose()
	shortExemptVolRatioLast: number;

	@Expose()
	totalVolLast: number;

	@Expose()
	shortVolRatio5DAVG: number;

	@Expose()
	shortExemptVolRatio5DAVG: number;

	@Expose()
	totalVol5DAVG: number;

	@Expose()
	shortVolRatio20DAVG: number;

	@Expose()
	shortExemptVolRatio20DAVG: number;

	@Expose()
	totalVol20DAVG: number;

	@Expose()
	version: string;

	@Expose()
	volume: Volume[];
}
