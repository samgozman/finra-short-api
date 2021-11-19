import {
	Controller,
	Get,
	Query,
	UseGuards,
	UseInterceptors,
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
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

@ApiTags('filter')
@Controller('filter')
@UseInterceptors(new SentryInterceptor())
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
