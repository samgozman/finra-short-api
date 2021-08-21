import { Controller, Get, Query } from '@nestjs/common';
import { GetFiltredStocksDto } from './dtos/get-filtred-stocks.dto';
import { FiltersService } from './filters.service';

@Controller('filter')
export class FiltersController {
	constructor(filtersService: FiltersService) {}

	@Get()
	getFilter(@Query() query: GetFiltredStocksDto) {
		return query;
	}
}
