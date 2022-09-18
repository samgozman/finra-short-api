import got from 'got';
import moment from 'moment';
import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { FinraAssignedReports } from '../volumes/schemas/volume.schema';

/** Parse FINRA */
@Injectable()
export class ParseService {
	private readonly logger = new Logger(ParseService.name);

	getAllDaysPages(): string[] {
		function getDatesPages(startDate: Date, endDate: Date) {
			const dates = [];
			let currentDate = startDate;
			const addDays = function (days: number) {
				const date = new Date(this.valueOf());
				date.setDate(date.getDate() + days);
				return date;
			};
			while (currentDate <= endDate) {
				const dayOfWeek = moment(currentDate).weekday();

				if (dayOfWeek !== 6 && dayOfWeek !== 0) {
					// If not weekend
					const d = moment(currentDate).format('YYYYMMDD');
					dates.push(
						`https://cdn.finra.org/equity/regsho/daily/CNMSshvol${d}.txt`,
					);
				}

				currentDate = addDays.call(currentDate, 1);
			}
			return dates;
		}

		return getDatesPages(new Date(2018, 9, 10), new Date());
	}

	/**
	 * Get Finra short report for each stock
	 * @async
	 * @param url Link to the report file (.txt)
	 * @return Object promise: ticker: FinraReport
	 */
	async getDataFromFile(url: string): Promise<FinraAssignedReports> {
		try {
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
		} catch (error) {
			if (!(error instanceof got.HTTPError)) {
				this.logger.error(`Error in ${this.getDataFromFile.name}`, error);
				throw new InternalServerErrorException();
			}
			return {};
		}
	}
}
