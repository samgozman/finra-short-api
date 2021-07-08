import { Router, Response } from 'express';
import { RequestAuth } from '../middleware/RequestAuth';
import { Stock } from '../models/Stock';
import { getFilter, Filters } from '../filter';
import auth from '../middleware/auth';

const filterRouter = Router();

// GET /filter?limit=10&skip=0
filterRouter.get('/filter', auth, async (req: RequestAuth, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 25;
        const skip = parseInt(req.query.skip as string) || 0;
        const filters = req.query.filters as string;

        // Validate limit & skip
        if (limit > 100 || skip < 0) throw new Error();

        if (filters) {
            const filtersArray = filters
                .replace(/[^A-z0-9,]/g, '')
                .split(',')
                .map((e) => e as Filters);
            const ids = await getFilter(...filtersArray);
            const stocks = [];
            for (const id of ids) {
                const stock = (await Stock.findById(id))!.ticker;
                stocks.push(stock);
            }
            res.send(stocks);
        } else {
            const stocks = (
                await Stock.find({}, null, {
                    limit,
                    skip,
                })
            ).map((e) => e.ticker);
            res.send(stocks);
        }
    } catch (error) {
        res.status(404).send('Filter request error!');
    }
});

export default filterRouter;
