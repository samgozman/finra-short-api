import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Model } from 'mongoose';

export type Virtuals = 'volume' | 'filter';
export type SortDirs = 'desc' | 'asc';

export interface IStockDocument extends Stock, Document {}

/** Interface of main stock keys */
export interface IStock {
  ticker: string;
  // Percent values
  shortVolRatioLast: number;
  shortExemptVolRatioLast: number;
  shortVolRatio5DAVG: number;
  shortExemptVolRatio5DAVG: number;
  shortVolRatio20DAVG: number;
  shortExemptVolRatio20DAVG: number;
  // Numeric
  shortExemptVolLast: number;
  shortExemptVol5DAVG: number;
  shortExemptVol20DAVG: number;
  shortVolLast: number;
  shortVol5DAVG: number;
  shortVol20DAVG: number;
  totalVolLast: number;
  totalVol5DAVG: number;
  totalVol20DAVG: number;
}

/** List of stock keys */
export type StockKeys = keyof IStock & string;

@Schema({ toJSON: { virtuals: true } })
export class Stock implements IStock {
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
    unique: true,
    maxLength: 14,
    trim: true,
    set: (v: string) => v.replace(/p/g, '-').replace(/\//g, '.'),
  })
  ticker: string;

  @ApiProperty()
  @Prop()
  shortVolRatioLast: number;

  @ApiProperty()
  @Prop()
  shortExemptVolRatioLast: number;

  @ApiProperty()
  @Prop()
  shortVolRatio5DAVG: number;

  @ApiProperty()
  @Prop()
  shortExemptVolRatio5DAVG: number;

  @ApiProperty()
  @Prop()
  shortVolRatio20DAVG: number;

  @ApiProperty()
  @Prop()
  shortExemptVolRatio20DAVG: number;

  // Numeric avg
  @ApiProperty()
  @Prop()
  totalVolLast: number;

  @ApiProperty()
  @Prop()
  totalVol5DAVG: number;

  @ApiProperty()
  @Prop()
  totalVol20DAVG: number;

  @ApiProperty()
  @Prop()
  shortExemptVolLast: number;

  @ApiProperty()
  @Prop()
  shortExemptVol5DAVG: number;

  @ApiProperty()
  @Prop()
  shortExemptVol20DAVG: number;

  @ApiProperty()
  @Prop()
  shortVolLast: number;

  @ApiProperty()
  @Prop()
  shortVol5DAVG: number;

  @ApiProperty()
  @Prop()
  shortVol20DAVG: number;
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
