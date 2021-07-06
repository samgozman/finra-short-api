import { ObjectId } from 'mongoose';
import { Tinkoff } from 'tinkoff-api-securities';
import { IFilter, Filter } from './models/Filter';
import { StockPopulatedDocument } from './models/PopulatedVolume';
import { Stock } from './models/Stock';
import round from './utils/round';

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

/* FILTERS SECTION: START */

export async function onTinkoffFIlter() {
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

export async function shortVolGrowsFilter(limit: number = 5) {
    await resetFilter('shortVolGrows5D');
    // increment limit to be able to compare index 1 to index 0
    limit++;
    const allIds = await Stock.avalibleTickers();
    for (const _id of allIds) {
        const stock = (await Stock.findById(_id))!;
        const volume = (await stock.getVirtual('volume', limit, 'desc')).volume;

        // Check if populated volume exists
        if (volume.length === limit) {
            const shortVolArr = volume.map((e) => e.shortVolume).reverse();
            // each value is greater than previous
            const validation: boolean[] = shortVolArr.map((e, i) => shortVolArr[i] > shortVolArr[i - 1]);
            // Remove first element of the array (it was used for comparing only)
            validation.shift();
            // If all validations in row are true
            const checker = validation.every((v) => v === true);
            await updateFilter(_id, 'shortVolGrows5D', checker);
        }
    }
}

/* FILTERS SECTION: END */
