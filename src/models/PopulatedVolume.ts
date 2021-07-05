import { IStockDocument } from './Stock';
import { FinraReport } from './Volume';

export interface PopulatedVolume {
    volume: FinraReport[];
}

export interface StockPopulatedDocument extends IStockDocument, PopulatedVolume {}
