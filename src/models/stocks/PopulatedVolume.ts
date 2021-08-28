import { IStockDocument } from './schemas/stock.schema';
import { FinraReport } from '../volumes/schemas/volume.schema';

export interface PopulatedVolume {
	volume: FinraReport[];
}

export interface StockPopulatedDocument
	extends IStockDocument,
		PopulatedVolume {}
