import { Router, Response } from 'express';
import { RequestAuth } from '../middleware/RequestAuth';
import { IStockDocument, Stock } from '../models/Stock';
import { IRoutersStock, IStockExtension } from './interface';
import auth from '../middleware/auth';
import { LeanDocument } from 'mongoose';

interface StockStringified extends LeanDocument<IStockDocument>, IStockExtension {}

const stockRouter = Router();

stockRouter.get('/stock', auth, async (req: RequestAuth, res: Response<IRoutersStock>) => {
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

            const stockJson: StockStringified = stock.toJSON({
                virtuals: true,
            });

            delete stockJson._id;
            delete stockJson.id;
            delete stockJson.__v;

            stockJson.version = process.env.npm_package_version;
            return res.send(stockJson);
        } else {
            throw new Error();
        }
    } catch (error) {
        return res.status(404).send();
    }
});

export default stockRouter;
