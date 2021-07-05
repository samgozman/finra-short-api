import { Router, Response } from 'express';
import { Tinkoff } from 'tinkoff-api-securities';
import { Stock } from '../models/Stock';
import { FinraReport } from '../models/Volume';
import { StockPopulatedDocument } from '../models/PopulatedVolume';
import auth from '../middleware/auth';
import { RequestAuth } from '../middleware/RequestAuth';
import round from '../utils/round';

const topRouter = Router();

topRouter.get('/top', auth, async (req: RequestAuth, res: Response) => {
    try {
        const limit = req.query.limit || 5;
        const tinkoffOnly = req.query.tinkoffOnly;
        const minvol = req.query.minvol;

        const allIds = await Stock.avalibleTickers();
        let top = [];

        // Calculate average short volume
        const avgShortVol = (arr: FinraReport[]) => {
            let sum = 0;
            for (const i in arr) {
                sum += (arr[i].shortVolume / arr[i].totalVolume) * 100;
            }
            return round(sum / arr.length);
        };

        // Find populate all stocks volumes
        for (const _id of allIds) {
            let stock: StockPopulatedDocument = (await Stock.findById(_id)) as StockPopulatedDocument;
            await stock
                .populate({
                    path: 'volume',
                    options: {
                        limit,
                        sort: {
                            date: 'desc',
                        },
                    },
                })
                .execPopulate();

            if (stock.volume && stock.volume[0]) {
                top.push({
                    shortVol: avgShortVol(stock.volume),
                    totalVol: stock.volume[0].totalVolume,
                    ticker: stock.ticker,
                });
            }
        }

        // Filter by tinkoff
        if (tinkoffOnly === 'true') {
            const tinkoff = new Tinkoff(process.env.SANDBOX_TOKEN!);
            const onTinkoff = await tinkoff.stocks('USD');
            let tinkedArr = [];
            for (const tink of onTinkoff) {
                const obj = top.find((x) => x.ticker === tink.ticker);
                if (obj) {
                    tinkedArr.push({
                        shortVol: obj.shortVol,
                        totalVol: obj.totalVol,
                        ticker: tink.ticker,
                    });
                }
            }
            top = tinkedArr;
        }

        // Filter by min volume
        if (minvol === 'true') {
            const min = 5000;
            const minArr = [];
            for (const el of top) {
                if (el.totalVol > min) {
                    minArr.push({
                        shortVol: el.shortVol,
                        totalVol: el.totalVol,
                        ticker: el.ticker,
                    });
                }
            }
            top = minArr;
        }

        // Sort from high to low
        top = top.sort(function (a, b) {
            return b.shortVol - a.shortVol;
        });

        res.send(top);
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});

export default topRouter;
