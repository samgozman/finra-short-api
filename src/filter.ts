import { ObjectId } from 'mongoose';
import { Tinkoff } from 'tinkoff-api-securities';
import { IFilter, Filter } from './models/Filter';
import { Stock } from './models/Stock';

/** Filter keys */
type Filters = keyof IFilter & string;

/**
 * Function to update any filter
 * @param _stock_id Mongo ID of parent instacne from db.stocks
 * @param key Filtering key name
 * @param value Filtering value (true or false)
 */
async function updateFilter(_stock_id: ObjectId, key: Filters, value: boolean = true) {
    // Find filter for _stock_id
    const filter = await Filter.findOne({ _stock_id });
    if (filter) {
        // If it is existing - update
        await filter.updateOne({
            [key]: value,
        });
    } else {
        // If not - create
        const newFilter = new Filter({
            _stock_id,
            [key]: value,
        });

        await newFilter.save();
    }
}

/**
 * Reset filter (change all 'true' values on 'false')
 * @param key Filtering key name
 */
async function resetFilter(key: Filters) {
    await Filter.updateMany({ [key]: true }, { [key]: false });
}

/**
 * Get an array of Stocks ObjectId's matching the filtering condition's.
 * @param keys Filtering key names. Multiple names to create union
 * @returns Promise array of ObjectId's
 */
export async function getFilter(...keys: Filters[]): Promise<ObjectId[]> {
    // Convert filter keys to object like {key: true, ...}
    const keyPairs = keys.reduce((ac, a) => ({ ...ac, [a]: true }), {});
    const stocks = await Filter.find(keyPairs);
    const ids: ObjectId[] = [];

    for (const stock of stocks) {
        ids.push(stock._stock_id);
    }

    return ids;
}

interface FilterUnit {
    filter: Filters;
    update(): Promise<void>;
    get(): Promise<ObjectId[]>;
}

class VolumeFilter implements FilterUnit {
    constructor(
        public filter: Filters,
        public volType: 'shortVolume' | 'shortExemptVolume' | 'totalVolume',
        public momentum: 'growing' | 'decreasing',
        public period: number = 5,
        public ratio: boolean = false
    ) {}

    /** Update filters in MongoDB */
    async update() {
        await resetFilter(this.filter);
        const allIds = await Stock.avalibleTickers();
        for (const _id of allIds) {
            const stock = (await Stock.findById(_id))!;
            const volume = (await stock.getVirtual('volume', this.period + 1, 'desc')).volume;

            // Check if populated volume exists
            if (volume && volume.length > 1) {
                const volArr = this.ratio
                    ? volume.map((e) => e[this.volType] / e.totalVolume).reverse()
                    : volume.map((e) => e[this.volType]).reverse();
                // Validate each value is greater / lesser than previous
                const validation: boolean[] =
                    this.momentum === 'growing'
                        ? volArr.map((e, i: number) => volArr[i] > volArr[i - 1])
                        : volArr.map((e, i: number) => volArr[i] < volArr[i - 1]);
                // Remove first element of the array (it was used for comparing only)
                validation.shift();
                // If all validations in row are true
                const checker = validation.every((v) => v === true);
                await updateFilter(_id, this.filter, checker);
            }
        }
    }

    async get(): Promise<ObjectId[]> {
        return await getFilter(this.filter);
    }
}

/* FILTERS SECTION: START */

export async function onTinkoff() {
    await resetFilter('onTinkoff');
    const tinkoff = new Tinkoff(process.env.SANDBOX_TOKEN!);
    const onTinkoff = await tinkoff.stocks('USD');
    for (const tink of onTinkoff) {
        // Find Stock
        const { ticker } = tink;
        const stock = await Stock.findOne({ ticker });
        // Get ID
        const _stock_id: ObjectId = stock?.id;
        // Create record
        if (_stock_id) {
            await updateFilter(_stock_id, 'onTinkoff', true);
        }
    }
}

export const shortVolGrows5D = new VolumeFilter('shortVolGrows5D', 'shortVolume', 'growing', 5);
export const shortVolDecreases5D = new VolumeFilter('shortVolDecreases5D', 'shortVolume', 'decreasing', 5);
export const shortVolRatioGrows5D = new VolumeFilter(
    'shortVolRatioGrows5D',
    'shortVolume',
    'growing',
    5,
    true
);
export const shortVoRatiolDecreases5D = new VolumeFilter(
    'shortVoRatiolDecreases5D',
    'shortVolume',
    'decreasing',
    5,
    true
);
export const totalVolGrows5D = new VolumeFilter('totalVolGrows5D', 'totalVolume', 'growing', 5);
export const totalVolDecreases5D = new VolumeFilter('totalVolDecreases5D', 'totalVolume', 'decreasing', 5);

/* FILTERS SECTION: END */
