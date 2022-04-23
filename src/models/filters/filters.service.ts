import { Injectable } from '@nestjs/common';
import { StocksService } from '../stocks/stocks.service';
import { FilteredStocksDto } from './dtos/filtered-stocks.dto';
import { GetFilteredStocksDto } from './dtos/get-filtered-stocks.dto';
import { FilterUnitService } from './filter-unit.service';

@Injectable()
export class FiltersService {
	constructor(
		private readonly fus: FilterUnitService,
		private readonly stocksService: StocksService,
	) {}

	/**
	 * Get filtered stocks by query
	 * @param query GetFilteredStocksDto
	 */
	async get(query: GetFilteredStocksDto): Promise<FilteredStocksDto> {
		const { filters } = query;

		if (filters) {
			// Get filtered values
			return this.fus.getFilter(query);
		} else {
			// Get all stocks without filters
			return this.stocksService.getAllStocks(query);
		}
	}
}
