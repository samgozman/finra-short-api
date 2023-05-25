import {
	Controller,
	Get,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { GetFilteredStocksDto } from './dtos/get-filtered-stocks.dto';
import { FiltersService } from './filters.service';
import { FilteredStocksDto } from './dtos/filtered-stocks.dto';

@ApiTags('filter')
@Controller('filter')
export class FiltersController {
	constructor(private filtersService: FiltersService) {}

	@Get()
	@Roles('screener')
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Get filtered stocks by query' })
	@ApiOkResponse({
		description: 'Filters response object',
		type: FilteredStocksDto,
	})
	@ApiForbiddenResponse()
	@ApiSecurity('user-api-token')
	getFilter(@Query() query: GetFilteredStocksDto) {
		return this.filtersService.get(query);
	}
}
