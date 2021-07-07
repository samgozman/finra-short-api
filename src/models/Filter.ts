import { Schema, model, Document, Model } from 'mongoose';

export interface IFilter {
    /** Stock is available on Tinkoff broker */
    onTinkoff: boolean;
    /** Short volume is growing 5 days in a row */
    shortVolGrows5D: boolean;
    /** Short volume is decreasing 5 days in a row */
    shortVolDecreases5D: boolean;
    /** Short volume ratio (%) is growing 5 days in a row */
    shortVolRatioGrows5D: boolean;
    /** Short volume ratio (%) is decreasing 5 days in a row */
    shortVoRatiolDecreases5D: boolean;
    /** Total volume is growing 5 days in a row */
    totalVolGrows5D: boolean;
    /** Total volume is decreasing 5 days in a row */
    totalVolDecreases5D: boolean;
    /** Short Exempt volume is growing 5 days in a row */
    shortExemptVolGrows5D: boolean;
    /** Short Exempt volume is decreasing 5 days in a row */
    shortExemptVolDecreases5D: boolean;
    /** Short Exempt volume ratio is growing 5 days in a row */
    shortExemptVolRatioGrows5D: boolean;
    /** Short Exempt volume ratio is decreasing 5 days in a row */
    shortExemptVolRatioDecreases5D: boolean;
}

export interface IFilterDocument extends IFilter, Document {
    _stock_id: Schema.Types.ObjectId;
}
export interface IFilterModel extends Model<IFilterDocument> {}

const filterSchema = new Schema<IFilterDocument, IFilterModel>({
    _stock_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Stock',
    },
    onTinkoff: {
        type: Boolean,
        default: false,
    },
    shortVolGrows5D: {
        type: Boolean,
        default: false,
    },
    shortVolDecreases5D: {
        type: Boolean,
        default: false,
    },
    shortVolRatioGrows5D: {
        type: Boolean,
        default: false,
    },
    shortVoRatiolDecreases5D: {
        type: Boolean,
        default: false,
    },
    totalVolGrows5D: {
        type: Boolean,
        default: false,
    },
    totalVolDecreases5D: {
        type: Boolean,
        default: false,
    },
    shortExemptVolGrows5D: {
        type: Boolean,
        default: false,
    },
    shortExemptVolDecreases5D: {
        type: Boolean,
        default: false,
    },
    shortExemptVolRatioGrows5D: {
        type: Boolean,
        default: false,
    },
    shortExemptVolRatioDecreases5D: {
        type: Boolean,
        default: false,
    },
});

export const Filter = model<IFilterDocument, IFilterModel>('Filter', filterSchema);
