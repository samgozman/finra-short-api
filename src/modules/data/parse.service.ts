import got from 'got';
import { isWeekend, format, parse } from 'date-fns';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FinraAssignedReports } from './interfaces/finra-assigned-report.interface';

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
        if (!isWeekend(currentDate)) {
          const d = format(currentDate, 'YYYYMMDD');
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
      const textArray = text.split(/\r?\n/);

      // Remove first and last 2 lines of the array
      textArray.shift();
      textArray.pop();
      textArray.pop();

      const obj: FinraAssignedReports = {};
      textArray.forEach((str) => {
        // String format: Date|Symbol|ShortVolume|ShortExemptVolume|TotalVolume|Market
        const strArr = str.split('|');
        const date = parse(strArr[0], 'YYYYMMDD', new Date());
        obj[strArr[1]] = {
          date: date,
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
