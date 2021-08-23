import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types, Schema as SchemaMongoose } from 'mongoose';

export interface IFilterDocument extends Filter, Document {}
// ! Deprecated?
export interface IFilterModel extends Model<IFilterDocument> {}

@Schema()
export class Filter {
	/** Parent stock id */
	@Prop({
		type: SchemaMongoose.Types.ObjectId,
		required: true,
		ref: 'Stock',
		unique: true,
	})
	_stock_id: Types.ObjectId;

	/** Stock is available on Tinkoff broker */
	@Prop({ default: false })
	onTinkoff: boolean;

	/** Filter new stocks with no data or incomplete */
	@Prop({ default: false })
	isNotGarbage: boolean;

	/** Short volume is growing 5 days in a row */
	@Prop({ default: false })
	shortVolGrows5D: boolean;

	/** Short volume is decreasing 5 days in a row */
	@Prop({ default: false })
	shortVolDecreases5D: boolean;

	/** Short volume ratio (%) is growing 5 days in a row */
	@Prop({ default: false })
	shortVolRatioGrows5D: boolean;

	/** Short volume ratio (%) is decreasing 5 days in a row */
	@Prop({ default: false })
	shortVoRatiolDecreases5D: boolean;

	/** Total volume is growing 5 days in a row */
	@Prop({ default: false })
	totalVolGrows5D: boolean;

	/** Total volume is decreasing 5 days in a row */
	@Prop({ default: false })
	totalVolDecreases5D: boolean;

	/** Short Exempt volume is growing 5 days in a row */
	@Prop({ default: false })
	shortExemptVolGrows5D: boolean;

	/** Short Exempt volume is decreasing 5 days in a row */
	@Prop({ default: false })
	shortExemptVolDecreases5D: boolean;

	/** Short Exempt volume ratio is growing 5 days in a row */
	@Prop({ default: false })
	shortExemptVolRatioGrows5D: boolean;

	/** Short Exempt volume ratio is decreasing 5 days in a row */
	@Prop({ default: false })
	shortExemptVolRatioDecreases5D: boolean;

	/** Short volume is growing 3 days in a row */
	@Prop({ default: false })
	shortVolGrows3D: boolean;

	/** Short volume is decreasing 3 days in a row */
	@Prop({ default: false })
	shortVolDecreases3D: boolean;

	/** Short volume ratio (%) is growing 3 days in a row */
	@Prop({ default: false })
	shortVolRatioGrows3D: boolean;

	/** Short volume ratio (%) is decreasing 3 days in a row */
	@Prop({ default: false })
	shortVoRatiolDecreases3D: boolean;

	/** Total volume is growing 3 days in a row */
	@Prop({ default: false })
	totalVolGrows3D: boolean;

	/** Total volume is decreasing 3 days in a row */
	@Prop({ default: false })
	totalVolDecreases3D: boolean;

	/** Short Exempt volume is growing 3 days in a row */
	@Prop({ default: false })
	shortExemptVolGrows3D: boolean;

	/** Short Exempt volume is decreasing 3 days in a row */
	@Prop({ default: false })
	shortExemptVolDecreases3D: boolean;

	/** Short Exempt volume ratio is growing 3 days in a row */
	@Prop({ default: false })
	shortExemptVolRatioGrows3D: boolean;

	/** Short Exempt volume ratio is decreasing 3 days in a row */
	@Prop({ default: false })
	shortExemptVolRatioDecreases3D: boolean;
}

export const FilterSchema = SchemaFactory.createForClass(Filter);

/** Model definition for MongooseModule usage */
export const FilterModel: ModelDefinition = {
	name: Filter.name,
	schema: FilterSchema,
};
