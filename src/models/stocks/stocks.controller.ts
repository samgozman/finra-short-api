import {
	Controller,
	Get,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GetStockDto } from './dtos/get-stock.dto';
import { StockDto } from './dtos/stock.dto';
import { StocksService } from './stocks.service';

@ApiTags('stock')
@Controller('stock')
@UseInterceptors(SentryInterceptor)
export class StocksController {
	constructor(private stocksService: StocksService) {}

	@Get()
	@SkipThrottle()
	@Roles('stockInfo')
	@UseGuards(RolesGuard)
	@Serialize(StockDto)
	@ApiSecurity('user-api-token')
	@ApiOperation({ summary: 'Find one stock object (with volumes) by ticker' })
	@ApiOkResponse({ description: 'Stock response object', type: StockDto })
	@ApiForbiddenResponse()
	@ApiNotFoundResponse()
	getStock(@Query() query: GetStockDto) {
		return this.stocksService.get(query);
	}
}
