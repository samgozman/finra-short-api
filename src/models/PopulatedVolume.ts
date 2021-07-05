import { IStockDocument } from './stock';
import { FinraReport } from './volume';

export interface PopulatedVolume {
    volume: FinraReport[];
}

export interface StockPopulatedDocument extends IStockDocument, PopulatedVolume {}
