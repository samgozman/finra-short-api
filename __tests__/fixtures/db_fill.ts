import mongoose from 'mongoose';
import { setupDB } from './db';
import { Stock } from '../../src/models/Stock';
import { Volume } from '../../src/models/Volume';
import { Filter } from '../../src/models/Filter';

// db data
import stocks from './db_data/stocks.json';
import volumes from './db_data/volumes.json';
import filters from './db_data/filters.json';

interface BaseId {
    _id: {
        $oid: string;
    };
    _stock_id?: {
        $oid: string;
    };
    date?: {
        $date: string;
    };
    [key: string]: any;
}

// Fix import _id & date format
const fixDb = (element: BaseId) => {
    const id = new mongoose.Types.ObjectId(element._id.$oid);
    const s: { [key: string]: any } = { ...element };
    s._id = id;

    if (element._stock_id) {
        s._stock_id = new mongoose.Types.ObjectId(element._stock_id.$oid);
    }

    if (element.date) {
        s.date = new Date(element.date.$date);
    }

    return s;
};

export const db_fill = async (nofilters = false) => {
    await setupDB();
    await Stock.insertMany(stocks);
    await Volume.insertMany(volumes.map(fixDb));
    if (!nofilters) await Filter.insertMany(filters);
};

// Stock
// { ticker: { $in: ["AAL", "ABBV", "BLUE", "KEY", "POSH", "RDS/A", "SNOW", "TSLA", "ZYNE", "ZYXI"] }}
// Volume
// { _stock_id: { $in: [ ObjectId('609ae995baea62217685346d'), ObjectId('609ae995baea62217685347c'), ObjectId('609ae9a6baea6221768537e8'), ObjectId('609ae9eabaea6221768544fa'), ObjectId('609bb81c8f08b04b11f6aa66'), ObjectId('609aea10baea622176854c70'), ObjectId('609b9a738f08b04b11eb9e20'), ObjectId('609aea28baea622176855139'), ObjectId('609aea39baea622176855489'), ObjectId('609aea39baea62217685548a') ] } }
