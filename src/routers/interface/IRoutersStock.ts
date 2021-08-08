import { IStock } from '../../models/Stock';
import { FinraReport } from '../../models/Volume';

export interface IStockExtension {
    volume?: FinraReport[];
    version?: string | undefined;
}

export interface IRoutersStock extends IStock, IStockExtension {}
