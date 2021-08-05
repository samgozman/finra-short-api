import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IFilter {
    /** Stock is available on Tinkoff broker */
    onTinkoff: boolean;
    /** Filter new stocks with no data or incomplete */
    isNotGarbage: boolean;
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
    /** Short volume is growing 3 days in a row */
    shortVolGrows3D: boolean;
    /** Short volume is decreasing 3 days in a row */
    shortVolDecreases3D: boolean;
    /** Short volume ratio (%) is growing 3 days in a row */
    shortVolRatioGrows3D: boolean;
    /** Short volume ratio (%) is decreasing 3 days in a row */
    shortVoRatiolDecreases3D: boolean;
    /** Total volume is growing 3 days in a row */
    totalVolGrows3D: boolean;
    /** Total volume is decreasing 3 days in a row */
    totalVolDecreases3D: boolean;
    /** Short Exempt volume is growing 3 days in a row */
    shortExemptVolGrows3D: boolean;
    /** Short Exempt volume is decreasing 3 days in a row */
    shortExemptVolDecreases3D: boolean;
    /** Short Exempt volume ratio is growing 3 days in a row */
    shortExemptVolRatioGrows3D: boolean;
    /** Short Exempt volume ratio is decreasing 3 days in a row */
    shortExemptVolRatioDecreases3D: boolean;
}

export interface IFilterDocument extends IFilter, Document {
    _stock_id: Types.ObjectId;
}
export interface IFilterModel extends Model<IFilterDocument> {}

const filterSchema = new Schema<IFilterDocument, IFilterModel>({
    _stock_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'Stock',
        unique: true,
    },
    onTinkoff: {
        type: Boolean,
        default: false,
    },
    isNotGarbage: {
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
    shortVolGrows3D: {
        type: Boolean,
        default: false,
    },
    shortVolDecreases3D: {
        type: Boolean,
        default: false,
    },
    shortVolRatioGrows3D: {
        type: Boolean,
        default: false,
    },
    shortVoRatiolDecreases3D: {
        type: Boolean,
        default: false,
    },
    totalVolGrows3D: {
        type: Boolean,
        default: false,
    },
    totalVolDecreases3D: {
        type: Boolean,
        default: false,
    },
    shortExemptVolGrows3D: {
        type: Boolean,
        default: false,
    },
    shortExemptVolDecreases3D: {
        type: Boolean,
        default: false,
    },
    shortExemptVolRatioGrows3D: {
        type: Boolean,
        default: false,
    },
    shortExemptVolRatioDecreases3D: {
        type: Boolean,
        default: false,
    },
});

export const Filter = model<IFilterDocument, IFilterModel>('Filter', filterSchema);
