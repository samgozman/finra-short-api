import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { GetStockDto } from './dtos/get-stock.dto';
import { Volume } from '../volumes/volume.entity';

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
}
