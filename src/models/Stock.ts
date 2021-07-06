import { Schema, model, Document, Model, ObjectId } from 'mongoose';

export interface IStock {
    ticker: string;
}

export interface IStockDocument extends IStock, Document {
    version?: string;
}

export interface IStockModel extends Model<IStockDocument> {
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

/**
 * Get array of all available stocks
 * @async
 * @return {Array} Array of stocks
 */
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
