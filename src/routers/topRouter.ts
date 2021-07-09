// ! DEPRECATED !
// ! USE filterRouter !

import { Router, Response } from 'express';
import { Tinkoff } from 'tinkoff-api-securities';
import { Stock } from '../models/Stock';
import { FinraReport } from '../models/Volume';
import auth from '../middleware/auth';
import { RequestAuth } from '../middleware/RequestAuth';
import round from '../utils/round';

const topRouter = Router();

topRouter.get('/top', auth, async (req: RequestAuth, res: Response) => {
    try {
        // ! Need to change logic! First - create array of filtred unions
        // ! Next - populate and calculate
        const limit: number = +(req.query.limit || 5);
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
            const stock = (await Stock.findById(_id))!;
            const volume = (await stock.getVirtual('volume', limit, 'desc')).volume;

            if (volume && volume.length > 1) {
                top.push({
                    shortVol: avgShortVol(volume),
                    totalVol: volume[0].totalVolume,
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

        return res.send(top);
    } catch (error) {
        console.log(error);
        return res.status(404).send(error);
    }
});

export default topRouter;
