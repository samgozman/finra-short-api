import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Volume } from '../volumes/volume.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock, StockFilters, StockObject } from '../stocks/stock.entity';
import { Repository, In } from 'typeorm';

interface IVolumeGroupedByStockId {
  stockId: string;
  volumes: Volume[];
}

interface IVolumeGroupedByStockIdObject {
  [stockId: string]: Volume[];
}

interface IAverageTotalVolume {
  totalVolumeAvg: number;
  shortVolumeAvg: number;
  shortExemptVolumeAvg: number;
}

@Injectable()
export class AnalyzerService {
  private readonly logger = new Logger(AnalyzerService.name);
  constructor(
    @InjectRepository(Stock)
    private readonly stocksRepository: Repository<Stock>,
    @InjectRepository(Volume)
    private readonly volumesRepository: Repository<Volume>,
  ) {}

  public async analyze() {
    // ! 1. Get all stocks
    const stocks = await this.stocksRepository.find(); // TODO: Set attributes

    // ! 2. Get latest DB record time (useful to check that the volume is not outdated)
    const lrt = await this.getLatestRecordTime();
    // NOTE: filters moved to stock
    // ! 3. Calculate averages and save them in stocks array by pointer, update in db
    // stock.CalculateAverages(ctx, database, lrt, &stArr)
    await this.updateAverages(stocks, lrt);
    // ! 4. Drop filters collection
    // filter.Drop(ctx, database)
    // ! 5. Pass pointer to a stocks to each filter
    // filters := filter.CreateMany(ctx, database, lrt, &stArr)
    // ! 6. Save each filter individually (1 insert transaction for all stocks in 1 filter)
    // filter.InsertMany(ctx, database, &filters)
  }

  private async getLatestRecordTime(): Promise<Date> {
    const latestVolume = await this.volumesRepository.findOne({
      select: ['date'],
      where: {},
      order: { date: 'DESC' },
    });

    if (!latestVolume) {
      this.logger.error(
        `Error in ${this.getLatestRecordTime.name}: no latest volume found`,
      );
      throw new InternalServerErrorException();
    }

    return latestVolume.date;
  }

  private async updateAverages(
    stocks: Stock[],
    latestRecordTime: Date,
  ): Promise<void> {
    this.logger.log('Calculating averages: Started');

    // Clear all averages before calculating new ones
    await this.dropAveragesAndFilters(stocks);

    try {
      // Note: no need to specify stockId in where clause, because we take all
      const latestVolumes: IVolumeGroupedByStockId[] =
        await this.stocksRepository.query(
          `--sql
        SELECT
            s.id AS "stockId",
            json_agg(json_build_object(
                'id', v.id,
                'date', v.date,
                'shortVolume', v."shortVolume",
                'shortExemptVolume', v."shortExemptVolume",
                'totalVolume', v."totalVolume"
            )) AS volumes
        FROM
            "stocks" s
        JOIN (
            SELECT
                v1.id,
                v1."stockId",
                v1.date,
                v1."shortVolume",
                v1."shortExemptVolume",
                v1."totalVolume"
            FROM
                "volumes" v1
            ORDER BY v1.date DESC
            LIMIT 20
        ) v ON s.id = v."stockId"
        GROUP BY
            s.id
        ORDER BY
            s.id;
        `,
        );

      const latestVolumesObject: IVolumeGroupedByStockIdObject =
        latestVolumes.reduce((acc, { stockId, volumes }) => {
          acc[stockId] = volumes;
          return acc;
        }, {});

      console.log('🔥', latestVolumesObject);

      for (let i = 0; i < stocks.length; i++) {
        const latestVolumesForStock = latestVolumesObject[stocks[i].id];
        if (
          !latestVolumesForStock ||
          latestVolumesForStock[0].date !== latestRecordTime
        ) {
          continue;
        }

        stocks[i] = this.calculateStockVolumeAverages(
          stocks[i],
          latestVolumesForStock,
        );
      }

      await this.stocksRepository.save(stocks);
    } catch (error) {
      console.log('👹', error);
    }

    this.logger.log('Calculating averages: Done');
  }

  private async dropAveragesAndFilters(stocks: Stock[]): Promise<void> {
    for (const stock of stocks) {
      const zeroedStock: StockFilters & StockObject = {
        ticker: stock.ticker,
        shortVolRatioLast: null,
        shortExemptVolRatioLast: null,
        totalVolLast: null,
        totalVol5dAvg: null,
        shortVol5dAvg: null,
        shortExemptVol5dAvg: null,
        shortVolRatio5dAvg: null,
        shortExemptVolRatio5dAvg: null,
        shortVolRatio20dAvg: null,
        shortExemptVolRatio20dAvg: null,
        totalVol20dAvg: null,
        shortExemptVolLast: null,
        shortExemptVol20dAvg: null,
        shortVolLast: null,
        shortVol20dAvg: null,
        isNotGarbage: false,
        shortVolGrows5D: false,
        shortVolDecreases5D: false,
        shortVolRatioGrows5D: false,
        shortVolRatioDecreases5D: false,
        totalVolGrows5D: false,
        totalVolDecreases5D: false,
        shortExemptVolGrows5D: false,
        shortExemptVolDecreases5D: false,
        shortExemptVolRatioGrows5D: false,
        shortExemptVolRatioDecreases5D: false,
        shortVolGrows3D: false,
        shortVolDecreases3D: false,
        shortVolRatioGrows3D: false,
        shortVolRatioDecreases3D: false,
        totalVolGrows3D: false,
        totalVolDecreases3D: false,
        shortExemptVolGrows3D: false,
        shortExemptVolDecreases3D: false,
        shortExemptVolRatioGrows3D: false,
        shortExemptVolRatioDecreases3D: false,
        abnormalShortVolGrows: false,
        abnormalShortVolDecreases: false,
        abnormalTotalVolGrows: false,
        abnormalTotalVolDecreases: false,
        abnormalShortExemptVolGrows: false,
        abnormalShortExemptVolDecreases: false,
      };

      Object.assign(stock, zeroedStock);
    }

    await this.stocksRepository.save(stocks);
  }

  /**
   * Calculate groups of averages for a given volume and pass them to the Stock
   * @param stock
   * @param latestVolumes
   * @returns
   */
  private calculateStockVolumeAverages(
    stock: Stock,
    latestVolumes: Volume[],
  ): Stock {
    // 1 day
    stock.totalVolLast = latestVolumes[0].totalVolume;
    stock.shortVolLast = latestVolumes[0].shortVolume;
    stock.shortExemptVolLast = latestVolumes[0].shortExemptVolume;
    stock.shortVolRatioLast =
      (latestVolumes[0].shortVolume / latestVolumes[0].totalVolume) * 100;
    stock.shortExemptVolRatioLast =
      (latestVolumes[0].shortExemptVolume / latestVolumes[0].totalVolume) * 100;

    // 5 days
    if (latestVolumes.length >= 5) {
      const avg = this.avgVolume(latestVolumes.slice(0, 5));
      stock.totalVol5dAvg = avg.totalVolumeAvg;
      stock.shortVol5dAvg = avg.shortVolumeAvg;
      stock.shortExemptVol5dAvg = avg.shortExemptVolumeAvg;
      stock.shortVolRatio5dAvg =
        (avg.shortVolumeAvg / avg.totalVolumeAvg) * 100;
      stock.shortExemptVolRatio5dAvg =
        (avg.shortExemptVolumeAvg / avg.totalVolumeAvg) * 100;
    }

    // 20 days
    if (latestVolumes.length >= 20) {
      const avg = this.avgVolume(latestVolumes.slice(0, 20));
      stock.totalVol20dAvg = avg.totalVolumeAvg;
      stock.shortVol20dAvg = avg.shortVolumeAvg;
      stock.shortExemptVol20dAvg = avg.shortExemptVolumeAvg;
      stock.shortVolRatio20dAvg =
        (avg.shortVolumeAvg / avg.totalVolumeAvg) * 100;
      stock.shortExemptVolRatio20dAvg =
        (avg.shortExemptVolumeAvg / avg.totalVolumeAvg) * 100;
    }

    return stock;
  }

  /**
   * Calculate average volumes for a given array of volumes
   * @param volumes
   * @returns
   */
  private avgVolume(volumes: Volume[]): IAverageTotalVolume {
    const totalVolume = volumes.reduce(
      (acc, volume) => {
        acc.totalVolume += volume.totalVolume;
        acc.shortVolume += volume.shortVolume;
        acc.shortExemptVolume += volume.shortExemptVolume;
        return acc;
      },
      { totalVolume: 0, shortVolume: 0, shortExemptVolume: 0 },
    );

    return {
      totalVolumeAvg: totalVolume.totalVolume / volumes.length,
      shortVolumeAvg: totalVolume.shortVolume / volumes.length,
      shortExemptVolumeAvg: totalVolume.shortExemptVolume / volumes.length,
    };
  }
}
