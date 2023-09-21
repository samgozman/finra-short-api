import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FinraAssignedReports } from './interfaces/finra-assigned-report.interface';
import { Volume } from '../volumes/volume.entity';
import { ParseService } from './parse.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from '../stocks/stock.entity';
import { Repository } from 'typeorm';
import { AnalyzerService } from './analyzer.service';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);
  constructor(
    private parseService: ParseService,
    private analyzerService: AnalyzerService,
    @InjectRepository(Stock)
    private readonly stocksRepository: Repository<Stock>,
    @InjectRepository(Volume)
    private readonly volumesRepository: Repository<Volume>,
  ) {}

  async createVolumeArray(
    reports: FinraAssignedReports,
  ): Promise<Partial<Volume>[]> {
    if (Object.keys(reports).length === 0) {
      return [];
    }

    try {
      const volArr: Partial<Volume>[] = [];
      for (const report in reports) {
        // Try to find existing
        let stock = await this.stocksRepository.findOne({
          where: { ticker: report },
        });

        // If not - create
        if (!stock) {
          stock = await this.stocksRepository.save({
            ticker: report,
          });
        }

        volArr.push({
          stockId: stock.id,
          ...reports[report],
        });
      }

      return volArr;
    } catch (error) {
      this.logger.error(`Error in ${this.createVolumeArray.name}`, error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Recreate full database from the start.
   * When using the `reversed` option, you can add the missing days to the already generated base.
   * The script will stop at the first data duplication error.
   * @param reversed bypass an array of files from the last element
   */
  private async fillDataBase(reversed = false) {
    try {
      const files = reversed
        ? this.parseService.getAllDaysPages().reverse()
        : this.parseService.getAllDaysPages();
      for (const file in files) {
        const reports = await this.parseService.getDataFromFile(files[file]);
        const volArr = await this.createVolumeArray(reports);
        await this.volumesRepository.insert(volArr);
      }
    } catch (error) {
      if (error.code !== 11000) {
        this.logger.error(`Error in ${this.fillDataBase.name}`, error);
        throw new InternalServerErrorException();
      } else {
        this.logger.log(
          `${this.fillDataBase.name}: first duplication error. Data recording is stopped`,
        );
      }
    }
  }

  /** Update last trading days. */
  async updateLastTradingDays(): Promise<void> {
    try {
      this.logger.warn('Fetching last day data from FINRA has started');
      await this.fillDataBase(true);
      this.logger.log('Fetching last day data from FINRA has finished');
    } catch (error) {
      this.logger.error(`Error in ${this.updateLastTradingDays.name}`, error);
      throw new InternalServerErrorException();
    }
  }

  async updateFilters(): Promise<void> {
    try {
      this.logger.warn('Updating filters has started');
      // TODO: Rename it
      await this.analyzerService.analyze();
      this.logger.log('Updating filters has finished');
    } catch (error) {
      this.logger.error(`Error in ${this.updateFilters.name}`, error);
      throw new InternalServerErrorException();
    }
  }

  /** Creates db from the start */
  async recreateFullDatabase() {
    try {
      this.logger.warn('CREATING DATABASE FROM THE START');
      await this.fillDataBase(false);
      this.logger.log('Database rebuilding completed');
    } catch (error) {
      this.logger.error(`Error in ${this.recreateFullDatabase.name}`, error);
      throw new InternalServerErrorException();
    }
  }

  async updateVolumesByLink(link: string) {
    try {
      const reports = await this.parseService.getDataFromFile(link);
      const volArr = await this.createVolumeArray(reports);
      await this.volumesRepository.insert(volArr);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
