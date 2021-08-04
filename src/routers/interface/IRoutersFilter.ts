import { IStock } from '../../models/Stock';

export interface IRoutersFilter {
    count: number;
    stocks: IStock[];
}
