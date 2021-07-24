import { Volume } from '../models/Volume';

/**
 * Get number (ms) of the last trading day
 * @returns
 */
export const lastDateTime = async () => (await Volume.findOne().sort({ date: -1 }))!.date.getTime();
