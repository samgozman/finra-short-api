import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
	ApiOkResponse,
	ApiOperation,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { GetFiltredStocksDto } from './dtos/get-filtred-stocks.dto';
import { FiltersService } from './filters.service';
import { FiltredStocksDto } from './dtos/filtred-stocks.dto';

@ApiTags('filter')
@Controller('filter')
export class FiltersController {
	constructor(private filtersService: FiltersService) {}

	@Get()
	@Roles('screener')
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Get filtred stocks by query' })
	@ApiOkResponse({
		description: 'Filters response object',
		type: FiltredStocksDto,
	})
	@ApiSecurity('user-api-token')
	getFilter(@Query() query: GetFiltredStocksDto) {
		return this.filtersService.get(query);
	}
}
