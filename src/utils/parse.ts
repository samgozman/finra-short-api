import got from 'got';
import cheerio from 'cheerio';
import moment from 'moment-timezone';

import { Stock, IStockDocument } from '../models/Stock';
import { Volume, FinraAssignedReports, FinraMongo } from '../models/Volume';

moment.tz.setDefault('America/New_York');

interface Links {
    /** Key: 'Date of report', Value: url*/
    [key: string]: string;
}

/**
 * Get pages with monthly data
 * @async
 * @return Object promise: 'Mounth Year': 'Link'
 */
export const getMonthlyPages = async (): Promise<Links> => {
    try {
        const baseUrl = 'http://regsho.finra.org/regsho-Index.html';
        const response = await got(baseUrl);
        const $ = cheerio.load(response.body);

        const menuTable = $('body > table:nth-child(2) > tbody > tr > td');
        let links: Links = {};
        Array.prototype.map.call(menuTable, (td) => {
            const link = $(td).find('a');
            const key: string | undefined = link.text();
            if (key) {
                links[key] = link.attr('href') || '';
            } else {
                // Last / current menu item is empty.
                const currentPageDate = $('body > table:nth-child(2) > tbody > tr > td').last().text();
                links[currentPageDate] = baseUrl;
            }
        });

        return links;
    } catch (error) {
        return {
            error: error.message,
        };
    }
};

/**
 * Get links to the monthly reports
 * @async
 * @param url Link to the monthly page
 * @return Object promise: 'DayOfTheWeek Day': 'Link'
 */
export const getLinksToFiles = async (url: string): Promise<Links> => {
    try {
        const response = await got(url);
        const $ = cheerio.load(response.body);

        const filePathsNode = $('ul').first().find('li > a').toArray().reverse();
        let filePaths: Links = {};
        Array.prototype.map.call(filePathsNode, (a) => {
            const link = $(a);
            const key = link.text();
            if (key) filePaths[key] = link.attr('href') || '';
        });

        return filePaths;
    } catch (error) {
        return {
            error: error.message,
        };
    }
};

/**
 * Get Finra short report for each stock
 * @async
 * @param url Link to the report file (.txt)
 * @return Object promise: ticker: FinraReport
 */
export const getDataFromFile = async (url: string): Promise<FinraAssignedReports> => {
    const response = await got(url);
    const text = response.body.toString();
    let textArray = text.split(/\r?\n/);

    // Remove first and last 2 lines of the array
    textArray.shift();
    textArray.pop();
    textArray.pop();

    let obj: FinraAssignedReports = {};
    textArray.forEach((str) => {
        // String format: Date|Symbol|ShortVolume|ShortExemptVolume|TotalVolume|Market
        const strArr = str.split('|');
        obj[strArr[1]] = {
            date: new Date(moment(strArr[0], 'YYYYMMDD') as unknown as string),
            shortVolume: +strArr[2],
            shortExemptVolume: +strArr[3],
            totalVolume: +strArr[4],
        };
    });

    return obj;
};

/**
 * @async
 * @return Promise of array of dates
 */
export const getTradingDays = async (): Promise<moment.Moment[]> => {
    const pages = await getMonthlyPages();
    const fullDateObj: moment.Moment[] = [];
    for (const page in pages) {
        const daysObj = await getLinksToFiles(pages[page]);
        Object.keys(daysObj).forEach((el) => {
            const date = moment(+el.replace(/[A-z ]/g, '') + ' ' + page, 'DD MMM YYYY');
            fullDateObj.push(date);
        });
    }

    return fullDateObj;
};

/**
 * @async
 * @param reports
 * @return Array of FinraReport objects
 */
export const processLines = async (reports: FinraAssignedReports): Promise<FinraMongo[]> => {
    let mongoArr: FinraMongo[] = [];
    for (const report in reports) {
        // Try to find existing
        let stock: IStockDocument | null = await Stock.findOne({
            ticker: report,
        });

        // If not - create
        if (!stock) {
            stock = new Stock({
                ticker: report,
            });
            await stock.save();
        }

        mongoArr.push({
            _stock_id: stock._id,
            ...reports[report],
        });
    }

    return mongoArr;
};

export const updateLastTradingDay = async (): Promise<void> => {
    const files = await getLinksToFiles('http://regsho.finra.org/regsho-Index.html');
    const { [Object.keys(files).pop() as string]: currentDay } = files;
    const reports = await getDataFromFile(currentDay);
    let mongoArr = await processLines(reports);
    await Volume.insertMany(mongoArr);
};
