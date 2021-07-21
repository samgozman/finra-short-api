import { IStock, IStockDocument } from '../models/Stock';

/**
 * Hide from user DB-related keys
 * @param unsafe
 * @returns
 */
export function hideUnsafeKeys(unsafe: IStockDocument): IStock {
    const obj = unsafe.toObject();
    delete obj['__v'];
    delete obj['id'];
    delete obj['_id'];
    return obj as IStock;
}
