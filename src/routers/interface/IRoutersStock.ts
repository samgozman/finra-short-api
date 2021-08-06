import { IStock } from '../../models/Stock';

interface IVolumeReport {
    shortVolume: number;
    shortExemptVolume: number;
    totalVolume: number;
    date: string;
}

export interface IStockExtension {
    volume?: IVolumeReport[];
    version?: string | undefined;
}

export interface IRoutersStock extends IStock, IStockExtension {}
