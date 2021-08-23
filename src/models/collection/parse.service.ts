import got from 'got';
import cheerio from 'cheerio';
import moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';
import { FinraAssignedReports } from '../volumes/schemas/volume.schema';

moment.tz.setDefault('America/New_York');

// ! Think about proper error handling
// ! Setup nest logger

interface Links {
	/** Key: 'Date of report', Value: url*/
	[key: string]: string;
}

/** Parse FINRA */
@Injectable()
export class ParseService {
	/**
	 * Get pages with monthly data
	 * @async
	 * @return Object promise: 'Mounth Year': 'Link'
	 */
	async getMonthlyPages(): Promise<Links> {
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
					const currentPageDate = $(
						'body > table:nth-child(2) > tbody > tr > td',
					)
						.last()
						.text();
					links[currentPageDate] = baseUrl;
				}
			});

			return links;
		} catch (error) {
			return {
				error: error.message,
			};
		}
	}

	/**
	 * Get links to the monthly reports
	 * @async
	 * @param url Link to the monthly page
	 * @return Object promise: 'DayOfTheWeek Day': 'Link'
	 */
	async getLinksToFiles(url: string): Promise<Links> {
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
	}

	/**
	 * Get Finra short report for each stock
	 * @async
	 * @param url Link to the report file (.txt)
	 * @return Object promise: ticker: FinraReport
	 */
	async getDataFromFile(url: string): Promise<FinraAssignedReports> {
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
	}
}
