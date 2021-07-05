import { Schema, model, Document, Model } from 'mongoose';

export interface IStock {
    ticker: string;
}

export interface IStockDocument extends IStock, Document {
    version?: string;
}

export interface IStockModel extends Model<IStockDocument> {
    avalibleTickers(): Promise<any[]>;
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
stockSchema.statics.avalibleTickers = async function (): Promise<any[]> {
    const stocks: IStockDocument[] = await Stock.find({});
    return stocks.map((a: IStockDocument) => a._id);
};

stockSchema.virtual('volume', {
    ref: 'Volume',
    localField: '_id',
    foreignField: '_stock_id',
});

const Stock = model<IStockDocument, IStockModel>('Stock', stockSchema);
export default Stock;
