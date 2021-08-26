import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { GetFiltredStocksDto } from './dtos/get-filtred-stocks.dto';
import { FiltersService } from './filters.service';

@Controller('filter')
export class FiltersController {
	constructor(private filtersService: FiltersService) {}

	@Get()
	@Roles('screener')
	@UseGuards(RolesGuard)
	getFilter(@Query() query: GetFiltredStocksDto) {
		return this.filtersService.get(query);
	}
}
