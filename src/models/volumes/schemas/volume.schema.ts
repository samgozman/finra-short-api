import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaMongoose, Model } from 'mongoose';

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

export interface IVolumeDocument extends Volume, Document {}

@Schema()
export class Volume {
	@Prop({
		required: true,
		ref: 'Stock',
	})
	_stock_id: SchemaMongoose.Types.ObjectId;

	@Prop({
		required: true,
	})
	date: Date;

	@Prop({
		required: true,
		default: 0,
	})
	shortVolume: number;

	@Prop({
		required: true,
		default: 0,
	})
	shortExemptVolume: number;

	@Prop({
		required: true,
		default: 0,
	})
	totalVolume: number;

	/**
	 * Get obj by _stock_id
	 * @async
	 * @param {String} _stock_id ID of the parent stock to which this data belongs
	 * @return {Object} MongoDB saved model
	 */
	static findByStockId: (_stock_id: string) => Promise<IVolumeDocument>;
}

export const VolumeSchema = SchemaFactory.createForClass(Volume);

VolumeSchema.index(
	{
		_stock_id: 1,
		date: 1,
	},
	{
		unique: true,
	},
);

VolumeSchema.statics.findByStockId = async function (
	_stock_id: string,
): Promise<IVolumeDocument> {
	try {
		let instance: IVolumeDocument = await this.findOne({
			_stock_id,
		});

		if (!instance) {
			throw new Error();
		}

		return instance;
	} catch (error) {}
};

/** Model definition for MongooseModule usage */
export const VolumeModelDefinition: ModelDefinition = {
	name: Volume.name,
	schema: VolumeSchema,
};

/** Model type for injection */
export type VolumeModel = Model<IVolumeDocument>;
