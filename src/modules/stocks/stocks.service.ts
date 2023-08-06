import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock, StockFilters, sortKeysObject } from './stock.entity';
import { GetStockDto } from './dtos/get-stock.dto';
import { Volume } from '../volumes/volume.entity';
import { FilteredStocksDto } from './dtos/filtered-stocks.dto';
import { GetFilteredStocksDto } from './dtos/get-filtered-stocks.dto';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);
  constructor(
    @InjectRepository(Stock)
    private readonly stocksRepository: Repository<Stock>,
    @InjectRepository(Volume)
    private readonly volumesRepository: Repository<Volume>,
  ) {}

  public async get(query: GetStockDto): Promise<Stock> {
    const { ticker, limit, sort } = query;

    const stock = await this.stocksRepository.findOne({
      where: { ticker },
    });

    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    stock.volumes = await this.volumesRepository.find({
      select: ['date', 'shortVolume', 'shortExemptVolume', 'totalVolume'],
      where: { stockId: stock.id },
      order: { date: sort },
      take: limit,
    });

    return stock;
  }

  public async getFilteredStocks(
    query: GetFilteredStocksDto,
  ): Promise<FilteredStocksDto> {
    const { limit, skip, sortby, sortDir, tickers, filters } = query;

    const preparedFilters: Partial<StockFilters> = {};
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        preparedFilters[filter] = true;
      });
    }

    const result = await this.stocksRepository.findAndCount({
      select: sortKeysObject,
      where: { ticker: tickers ? In(tickers) : undefined, ...preparedFilters },
      order: { [sortby]: sortDir },
      take: limit,
      skip,
    });

    return {
      stocks: result[0],
      count: result[1],
    };
  }
}
