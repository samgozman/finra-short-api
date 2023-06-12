import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Stock } from '../stocks/schemas/stock.schema';
import { FilteredStocksDto } from './dtos/filtered-stocks.dto';
import { GetFilteredStocksDto } from './dtos/get-filtered-stocks.dto';
import { FiltersRepository } from './repositories/filters.repository';
import { IFiltersList } from './schemas/filter.schema';

export interface ISort {
  field: keyof Stock;
  dir: 'asc' | 'desc';
}

/** Filter keys */
export type Filters = keyof IFiltersList & string;

@Injectable()
export class FilterUnitService {
  private readonly logger = new Logger(FilterUnitService.name);
  constructor(private readonly filtersRepository: FiltersRepository) {}

  /**
   * Get an array of stocks matching the filter + receive total count
   * @param query GetFilteredStocksDto
   * @returns
   */
  async getFilter(query: GetFilteredStocksDto): Promise<FilteredStocksDto> {
    try {
      const { limit, skip, sortby, sortdir, filters, tickers } = query;

      // Convert filter keys to object like {key: true, ...}
      const keyPairs = filters.reduce((ac, a) => ({ ...ac, [a]: true }), {});

      const sortOptions: ISort = {
        field: sortby,
        dir: sortdir,
      };

      return this.filtersRepository.findStocksByFilteringCondition(
        keyPairs,
        limit,
        skip,
        sortOptions,
        tickers,
      );
    } catch (error) {
      this.logger.error(`Error in ${this.getFilter.name}`, error);
      throw new InternalServerErrorException();
    }
  }
}
