import { Schema, model, Document, Model, ObjectId } from 'mongoose';
import { StockPopulatedDocument } from './PopulatedVolume';

type Paths = 'volume' | 'filter';
type SortDirs = 'desc' | 'acs';

export interface IStock {
    ticker: string;
}

export interface IStockDocument extends IStock, Document {
    version?: string;
    // Methods
    /**
     * Populate virtual with sorting options
     * @param path virtual path ('volume' etc.)
     * @param limit max number of strokes to populate
     * @param sortDir sort direction (by date)
     * @returns
     */
    getVirtual(path: Paths, limit: number, sortDir?: SortDirs): Promise<StockPopulatedDocument>;
}

export interface IStockModel extends Model<IStockDocument> {
    // Statics
    /**
     * Get array of all available stocks
     * @async
     * @returns Promise array of stocks ObjectId's
     */
    avalibleTickers(): Promise<ObjectId[]>;
}

const stockSchema = new Schema<IStockDocument, IStockModel>(
    {
        ticker: {
            type: String,
            required: true,
            unique: true,
            maxLength: 14,
            trim: true,
            set: (v: string) => v.replace(/p/g, '-').replace(/\//g, '.'),
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

stockSchema.methods.getVirtual = async function (
    path: Paths = 'volume',
    limit: number,
    sortDir: SortDirs = 'desc'
): Promise<StockPopulatedDocument> {
    await this.populate({
        path,
        options: {
            limit,
            sort: {
                date: sortDir,
            },
        },
    }).execPopulate();

    return this as StockPopulatedDocument;
};

stockSchema.statics.avalibleTickers = async function (): Promise<ObjectId[]> {
    const stocks: IStockDocument[] = await Stock.find({});
    return stocks.map((a: IStockDocument) => a._id as ObjectId);
};

stockSchema.virtual('volume', {
    ref: 'Volume',
    localField: '_id',
    foreignField: '_stock_id',
});

stockSchema.virtual('filter', {
    ref: 'Filter',
    localField: '_id',
    foreignField: '_stock_id',
});

export const Stock = model<IStockDocument, IStockModel>('Stock', stockSchema);
