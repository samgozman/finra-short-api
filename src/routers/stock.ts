import { Router, Response } from 'express';
import { RequestAuth } from '../middleware/RequestAuth';
import { Stock } from '../models/Stock';
import auth from '../middleware/auth';

const stockRouter = Router();

stockRouter.get('/stock', auth, async (req: RequestAuth, res: Response) => {
    try {
        const ticker = req.query.ticker;
        const limit = req.query.limit;
        const sort = req.query.sort;

        let stock = await Stock.findOne({
            ticker: ticker as string,
        });

        if (stock) {
            await stock
                .populate({
                    path: 'volume',
                    options: {
                        limit,
                        sort: {
                            date: sort || 'asc',
                        },
                    },
                })
                .execPopulate();

            const stockJson = stock.toJSON({
                virtuals: true,
            });

            delete stockJson._id;
            delete stockJson.id;
            delete stockJson.__v;

            stockJson.version = process.env.npm_package_version;

            res.send(stockJson);
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(404).send('Stock is not found!');
    }
});

export default stockRouter;
