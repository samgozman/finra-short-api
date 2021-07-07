import { Schema, model, Document, Model } from 'mongoose';
import { toJSON } from '../utils/toJSON';

export interface FinraReport {
    date: Date;
    shortVolume: number;
    shortExemptVolume: number;
    totalVolume: number;
}

// Finra report assigned to each indiviual stock
export interface FinraAssignedReports {
    [ticker: string]: FinraReport;
}

export interface FinraMongo extends FinraReport {
    _stock_id?: Schema.Types.ObjectId;
}

// Finra volumes with mongoose Document properties
export interface IFinraDocument extends FinraMongo, Document {}
export interface IFinraModel extends Model<IFinraDocument> {}

const volumeSchema = new Schema<IFinraDocument, IFinraModel>({
    _stock_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Stock',
    },
    date: {
        type: Date,
        required: true,
    },
    shortVolume: {
        type: Number,
        required: true,
        default: 0,
    },
    shortExemptVolume: {
        type: Number,
        required: true,
        default: 0,
    },
    totalVolume: {
        type: Number,
        required: true,
        default: 0,
    },
});

volumeSchema.index(
    {
        _stock_id: 1,
        date: 1,
    },
    {
        unique: true,
    }
);

/**
 * Get obj by _stock_id
 * @async
 * @param {String} _stock_id ID of the parent stock to which this data belongs
 * @return {Object} MongoDB saved model
 */
volumeSchema.statics.findByStockId = async function (_stock_id) {
    try {
        let instance: IFinraDocument | null = await this.findOne({
            _stock_id,
        });

        if (!instance) {
            throw new Error();
        }

        return instance;
    } catch (error) {
        return {
            error: 'Error in static findByStockId()',
        };
    }
};

volumeSchema.methods.toJSON = toJSON;

export const Volume = model<IFinraDocument, IFinraModel>('Volume', volumeSchema);