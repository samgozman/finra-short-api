import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

export type Virtuals = 'volume' | 'filter';
export type SortDirs = 'desc' | 'asc';

export interface IStockDocument extends Stock, Document {}

/** Interface of main stock keys */
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

/** List of stock keys */
export type StockKeys = keyof IStock & string;

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
}

export const StockSchema = SchemaFactory.createForClass(Stock);

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
