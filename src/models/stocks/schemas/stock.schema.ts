import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { StockPopulatedDocument } from '../PopulatedVolume';

type Virtuals = 'volume' | 'filter';
type SortDirs = 'desc' | 'acs';

export interface IStockDocument extends Stock, Document {}

export interface IStock {
	ticker: string;
	shortVolRatioLast: number;
	shortExemptVolRatioLast: number;
	totalVolLast: number;
	shortVolRatio5DAVG: number;
	shortExemptVolRatio5DAVG: number;
	totalVol5DAVG: number;
	shortVolRatio20DAVG: number;
	shortExemptVolRatio20DAVG: number;
	totalVol20DAVG: number;
}

@Schema({ toJSON: { virtuals: true } })
export class Stock implements IStock {
	@Prop({
		type: String,
		required: true,
		unique: true,
		maxLength: 14,
		trim: true,
		set: (v: string) => v.replace(/p/g, '-').replace(/\//g, '.'),
	})
	ticker: string;

	@Prop()
	shortVolRatioLast: number;

	@Prop()
	shortExemptVolRatioLast: number;

	@Prop()
	totalVolLast: number;

	@Prop()
	shortVolRatio5DAVG: number;

	@Prop()
	shortExemptVolRatio5DAVG: number;

	@Prop()
	totalVol5DAVG: number;

	@Prop()
	shortVolRatio20DAVG: number;

	@Prop()
	shortExemptVolRatio20DAVG: number;

	@Prop()
	totalVol20DAVG: number;

	/**
	 * Populate virtual with sorting options
	 * @param path virtual path ('volume' etc.)
	 * @param limit max number of strokes to populate
	 * @param sortDir sort direction (by date)
	 * @returns Mongoose object with populated virtuals
	 */
	getVirtual: (
		path: Virtuals,
		limit: number,
		sortDir?: SortDirs,
	) => Promise<StockPopulatedDocument>;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

StockSchema.methods.getVirtual = async function (
	path: Virtuals = 'volume',
	limit: number,
	sortDir: SortDirs = 'desc',
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

StockSchema.virtual('volume', {
	ref: 'Volume',
	localField: '_id',
	foreignField: '_stock_id',
});

StockSchema.virtual('filter', {
	ref: 'Filter',
	localField: '_id',
	foreignField: '_stock_id',
});

/** Model definition for MongooseModule usage */
export const StockModelDefinition: ModelDefinition = {
	name: Stock.name,
	schema: StockSchema,
};

/** Model type for injection */
export type StockModel = Model<IStockDocument>;
