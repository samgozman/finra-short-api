import { Router, Response } from 'express';
import { RequestAuth } from '../middleware/RequestAuth';
import { IStock, Stock } from '../models/Stock';
import { getFilter, Filters } from '../filter';
import auth from '../middleware/auth';
import { hideUnsafeKeys } from '../utils/hideUnsafeKeys';

const filterRouter = Router();

// GET /filter?limit=10&skip=0
filterRouter.get('/filter', auth, async (req: RequestAuth, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 25;
        const skip = parseInt(req.query.skip as string) || 0;
        const sort = req.query.sort as string;
        const filters = req.query.filters as string;
        // Validate limit & skip
        if (limit > 100 || skip < 0) throw new Error();
        let sortObj = {};
        // Prepare sort
        if (sort) {
            const sortArr = sort.replace(/\s/gm, '').split(':');
            const dir = sortArr[1] === 'asc' ? 'asc' : 'desc';
            sortObj = {
                [sortArr[0]]: dir,
            };
        }

        if (filters) {
            const filtersArray = filters
                .replace(/[^A-z0-9,]/g, '')
                .split(',')
                .map((e) => e as Filters);
            const stocks = await getFilter(filtersArray, limit, skip, sortObj);
            return res.send(stocks);
        } else {
            const count = await Stock.estimatedDocumentCount();
            const stocks: IStock[] = (
                await Stock.find({}, null, {
                    limit,
                    skip,
                    sort: sortObj,
                })
            ).map((e) => hideUnsafeKeys(e));

            return res.send({ count, stocks });
        }
    } catch (error) {
        return res.status(404).send('Filter request error! ' + error);
    }
});

export default filterRouter;
