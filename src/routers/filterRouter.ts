import { Router, Response } from 'express';
import { RequestAuth } from '../middleware/RequestAuth';
import { IStock, Stock } from '../models/Stock';
import { getFilter, Filters } from '../filter';
import auth from '../middleware/auth';
import { sortObjectsArray } from '../utils/sortObjectsArray';

const filterRouter = Router();

// GET /filter?limit=10&skip=0
filterRouter.get('/filter', auth, async (req: RequestAuth, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 25;
        const skip = parseInt(req.query.skip as string) || 0;
        let sort = (req.query.sort as string).replace(/\s/gm, '').split(':');
        const filters = req.query.filters as string;

        // Validate limit & skip
        if (limit > 100 || skip < 0) throw new Error();

        let sortObj = {};
        // Prepare sort
        if (sort && sort.length > 0) {
            const dir = sort[1] === 'asc' ? 'asc' : 'desc';
            sortObj = {
                [sort[0]]: dir,
            };
        }

        if (filters) {
            const filtersArray = filters
                .replace(/[^A-z0-9,]/g, '')
                .split(',')
                .map((e) => e as Filters);
            const ids = await getFilter(filtersArray, limit, skip);
            const count = ids.count;
            let stocks: IStock[] = [];
            for (const id of ids.ids) {
                const stock: IStock = (await Stock.findById(id))!;
                stocks.push({
                    ticker: stock.ticker,
                    shortVolRatio5DAVG: stock.shortVolRatio5DAVG,
                    shortExemptVolRatio5DAVG: stock.shortExemptVolRatio5DAVG,
                    totalVol5DAVG: stock.totalVol5DAVG,
                    shortVolRatio20DAVG: stock.shortVolRatio20DAVG,
                    shortExemptVolRatio20DAVG: stock.shortExemptVolRatio20DAVG,
                    totalVol20DAVG: stock.totalVol20DAVG,
                });
            }
            // ! need to sort stocks
            stocks = sortObjectsArray(stocks, sortObj);
            return res.send({ count, stocks });
        } else {
            const count = await Stock.estimatedDocumentCount();
            const stocks: IStock[] = (
                await Stock.find({}, null, {
                    limit,
                    skip,
                    sort: sortObj,
                })
            ).map((e) => {
                return {
                    ticker: e.ticker,
                    shortVolRatio5DAVG: e.shortVolRatio5DAVG,
                    shortExemptVolRatio5DAVG: e.shortExemptVolRatio5DAVG,
                    totalVol5DAVG: e.totalVol5DAVG,
                    shortVolRatio20DAVG: e.shortVolRatio20DAVG,
                    shortExemptVolRatio20DAVG: e.shortExemptVolRatio20DAVG,
                    totalVol20DAVG: e.totalVol20DAVG,
                };
            });

            return res.send({ count, stocks });
        }
    } catch (error) {
        return res.status(404).send('Filter request error!');
    }
});

export default filterRouter;
