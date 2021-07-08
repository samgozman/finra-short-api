import { Router, Response } from 'express';
import { RequestAuth } from '../middleware/RequestAuth';
import { Volume } from '../models/Volume';
import {
    getMonthlyPages,
    getLinksToFiles,
    getDataFromFile,
    processLines,
    updateLastTradingDay,
} from '../utils/parse';
import admin from '../middleware/admin';

const collectionRouter = Router();

collectionRouter.get('/collection/recreate', admin, async (req: RequestAuth, res: Response) => {
    try {
        const pages = await getMonthlyPages();
        const files = [];

        // Get links to reports
        for (const page in pages) {
            const links = await getLinksToFiles(pages[page]);
            files.push(...Object.values(links));
        }

        // Process files
        for (const file in files) {
            const reports = await getDataFromFile(files[file]);
            let mongoArr = await processLines(reports);
            await Volume.insertMany(mongoArr);
        }

        return res.status(201).send();
    } catch (error) {
        return res.status(500).send(error);
    }
});

collectionRouter.get('/collection/updatelastday', admin, async (req: RequestAuth, res: Response) => {
    try {
        await updateLastTradingDay();

        return res.status(201).send();
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default collectionRouter;
