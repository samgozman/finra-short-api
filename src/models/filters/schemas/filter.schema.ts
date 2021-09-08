import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types, Schema as SchemaMongoose } from 'mongoose';

export interface IFilterDocument extends Filter, Document {}

/** List of all avalible filters */
export interface IFiltersList {
	// ? Presets filters
	/** Stock is available on Tinkoff broker */
	onTinkoff: boolean;
	/** Filter new stocks with no data or incomplete */
	isNotGarbage: boolean;

	// ? In-line sequence of 5d
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

	// ? In-line sequence of 3d
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

	// ? Abnormal volume
	/** Abnormal short volume growing */
	abnormalShortlVolGrows: boolean;
	/** Abnormal short volume decreasing */
	abnormalShortVolDecreases: boolean;
	/** Abnormal total volume growing */
	abnormalTotalVolGrows: boolean;
	/** Abnormal total volume decreasing */
	abnormalTotalVolDecreases: boolean;
	/** Abnormal short exempt volume growing */
	abnormalShortExemptVolGrows: boolean;
	/** Abnormal short exempt volume decreasing */
	abnormalShortExemptVolDecreases: boolean;
}

@Schema()
export class Filter implements IFiltersList {
	@Prop({
		type: SchemaMongoose.Types.ObjectId,
		required: true,
		ref: 'Stock',
		unique: true,
	})
	_stock_id: Types.ObjectId;

	// Presets filters
	@Prop({ default: false })
	onTinkoff: boolean;

	@Prop({ default: false })
	isNotGarbage: boolean;

	// In-line sequence of 5d
	@Prop({ default: false })
	shortVolGrows5D: boolean;

	@Prop({ default: false })
	shortVolDecreases5D: boolean;

	@Prop({ default: false })
	shortVolRatioGrows5D: boolean;

	@Prop({ default: false })
	shortVoRatiolDecreases5D: boolean;

	@Prop({ default: false })
	totalVolGrows5D: boolean;

	@Prop({ default: false })
	totalVolDecreases5D: boolean;

	@Prop({ default: false })
	shortExemptVolGrows5D: boolean;

	@Prop({ default: false })
	shortExemptVolDecreases5D: boolean;

	@Prop({ default: false })
	shortExemptVolRatioGrows5D: boolean;

	@Prop({ default: false })
	shortExemptVolRatioDecreases5D: boolean;

	// In-line sequence of 3d
	@Prop({ default: false })
	shortVolGrows3D: boolean;

	@Prop({ default: false })
	shortVolDecreases3D: boolean;

	@Prop({ default: false })
	shortVolRatioGrows3D: boolean;

	@Prop({ default: false })
	shortVoRatiolDecreases3D: boolean;

	@Prop({ default: false })
	totalVolGrows3D: boolean;

	@Prop({ default: false })
	totalVolDecreases3D: boolean;

	@Prop({ default: false })
	shortExemptVolGrows3D: boolean;

	@Prop({ default: false })
	shortExemptVolDecreases3D: boolean;

	@Prop({ default: false })
	shortExemptVolRatioGrows3D: boolean;

	@Prop({ default: false })
	shortExemptVolRatioDecreases3D: boolean;

	// Abnormal volume
	@Prop({ default: false })
	abnormalShortlVolGrows: boolean;

	@Prop({ default: false })
	abnormalShortVolDecreases: boolean;

	@Prop({ default: false })
	abnormalTotalVolGrows: boolean;

	@Prop({ default: false })
	abnormalTotalVolDecreases: boolean;

	@Prop({ default: false })
	abnormalShortExemptVolGrows: boolean;

	@Prop({ default: false })
	abnormalShortExemptVolDecreases: boolean;
}

export const FilterSchema = SchemaFactory.createForClass(Filter);

/** Model definition for MongooseModule usage */
export const FilterModelDefinition: ModelDefinition = {
	name: Filter.name,
	schema: FilterSchema,
};

/** Model type for injection */
export type FilterModel = Model<IFilterDocument>;
