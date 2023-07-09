import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { GetStockDto } from './dtos/get-stock.dto';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);
  constructor(
    @InjectRepository(Stock)
    private readonly stocksRepository: Repository<Stock>,
  ) {}

  public async get(query: GetStockDto): Promise<Stock> {
    const { ticker, limit, sort } = query;

    return this.stocksRepository
      .createQueryBuilder()
      .select('stocks')
      .leftJoinAndSelect('stocks.volumes', 'volume')
      .where('stock.ticker = :ticker', { ticker })
      .orderBy('volume.date', sort)
      .take(limit)
      .getOne();
  }
}
